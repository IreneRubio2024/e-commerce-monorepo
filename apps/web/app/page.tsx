"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import MainWrapper from "./components/MainWrapper";
import MobileProductPageLayout from "./components/MobileProductPageLayout";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import RetryImage from "./components/RetryImage";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setOpen(false);
      } else {
        setIsMobile(false);
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const fetched = await fetchProducts();
      setProducts(fetched);
      setLoading(false);
    };
    loadProducts();

    // Delay showing page content so Navbar appears first, independent of
    // how long the product fetch takes (e.g. a cold-started backend).
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (onlyInStock && !p.inStock) return false;
    if (
      debouncedQuery &&
      !p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar open={open} setOpen={setOpen} />
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          {isMobile ? (
            <MobileProductPageLayout
              open={open}
              setOpen={setOpen}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              filteredProducts={filteredProducts}
              onlyInStock={onlyInStock}
              setOnlyInStock={setOnlyInStock}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
            />
          ) : (
            <MainWrapper>
              <aside className="col-span-4">
                <div className="sticky top-32 flex flex-col bg-white p-8 border customGap">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex flex-col customGap">
                    <div className="flex flex-col border-b border-dotted border-gray-300 pb-4">
                      <h3 className="text-base font-medium mb-[1rem]">
                        Availability
                      </h3>
                      <Label
                        htmlFor="inStock"
                        className="flex items-center gap-[1rem] cursor-pointer select-none"
                      >
                        <Checkbox
                          id="inStock"
                          checked={onlyInStock}
                          onCheckedChange={(checked) =>
                            setOnlyInStock(!!checked)
                          }
                        />
                        <span>Show only in stock</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </aside>

              <section className="col-start-5 col-span-8 flex flex-col customGap">
                <div className="flex flex-col">
                  <span className="flex opacity-60 text-sm gap-[0.5rem] font-semibold mb-[0.5rem]">
                    <Link href="/">Home</Link> /{" "}
                    <Link href="/" className="opacity-30">
                      Products
                    </Link>
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-wide uppercase">
                    Products
                  </h1>
                </div>

                <div className="flex flex-row w-full customGap">
                  <div className="relative w-1/2">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-8"
                    />
                  </div>

                  <div className="flex uppercase gap-x-[1rem] gap-y-[0.5rem]">
                    <Button
                      onClick={() => setSelectedCategory(null)}
                      variant={
                        selectedCategory === null ? "default" : "secondary"
                      }
                    >
                      All
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        variant={
                          selectedCategory === cat ? "default" : "secondary"
                        }
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem] w-full">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full aspect-[265/314] bg-gray-200 animate-pulse"
                      />
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <div className="opacity-60 text-center col-span-full">
                      No products found
                    </div>
                  ) : (
                    filteredProducts.map((p, i) => (
                      <div key={i} className="w-full">
                        <Card className="rounded-none border-none">
                          {p.media?.[0] && (
                            <Link href={`/products/${p.slug}`}>
                              <RetryImage
                                src={p.media[0]}
                                alt={p.title}
                                width={265}
                                height={314}
                                className="w-full object-cover border"
                              />
                            </Link>
                          )}
                          <CardContent className="p-4 flex flex-col gap-2">
                            <p className="text-sm text-gray-500">
                              {p.category}
                            </p>
                            <div className="flex justify-between items-center">
                              <Link href={`/products/${p.slug}`}>
                                <CardTitle className="text-base font-medium hover:underline">
                                  {p.title}
                                </CardTitle>
                              </Link>
                              <span className="text-base font-semibold">
                                ${p.price}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </MainWrapper>
          )}
        </motion.div>
      )}
    </main>
  );
}
