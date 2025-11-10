"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";
import MobileProductPageLayout from "./components/MobileProductPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MainWrapper from "./components/MainWrapper";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Handle responsive
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

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const fetched = await fetchProducts();
      setProducts(fetched);
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (onlyInStock && !p.inStock) return false;
    return true;
  });

  return (
    <main className=" min-h-screen bg-white">
      <Navbar open={open} setOpen={setOpen} />

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
        />
      ) : (
        <MainWrapper>
          {/* Sidebar / Filter */}
          <aside className="col-span-4">
            <div className="sticky top-32 flex flex-col bg-white p-4 border customGap">
              <h2 className="text-lg font-semibold mb-4">Filter</h2>

              <div className="flex flex-col customGap">
                {/* Availability */}
                <div className="flex flex-col border-b border-dotted border-gray-300 pb-4 customGap">
                  <h3 className="text-base font-medium">Availability</h3>

                  <Label
                    htmlFor="inStock"
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <Checkbox
                      id="inStock"
                      checked={onlyInStock}
                      onCheckedChange={(checked) => setOnlyInStock(!!checked)}
                    />
                    <span>Show only in stock</span>
                  </Label>
                </div>

                {/* Category buttons can go here */}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="col-start-5 col-span-8 flex flex-col customGap">
            {/* Header */}
            <div className="flex flex-col  ">
              <span className="flex opacity-60 text-sm gap-[0.5rem] font-semibold mb-[0.5rem] ">
                <Link href="/">Home</Link> /{" "}
                <Link href="/" className="opacity-30">
                  Products
                </Link>
              </span>
              <h1 className="text-3xl font-extrabold tracking-wide uppercase ">
                Products
              </h1>
            </div>
            <div className=" flex flex-row w-full customGap ">
              <div className="relative w-1/2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pr-8"
                />
              </div>

              <div className="flex  uppercase gap-x-[1rem] gap-y-[0.5rem]">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  className={` `}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={``}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-3 customGap ">
              {filteredProducts.length === 0 ? (
                <div className="opacity-60 text-center col-span-full ">
                  No products found
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <Card key={p.id} className=" rounded-none border-none">
                    {p.media?.[0] && (
                      <Link href={`/products/${p.slug}`}>
                        <Image
                          src={p.media[0]}
                          alt={p.title}
                          width={265}
                          height={314}
                          className="w-full object-cover border "
                        />
                      </Link>
                    )}
                    <CardContent className="p-4 flex flex-col gap-2">
                      {/* Category */}
                      <p className="text-sm text-gray-500">{p.category}</p>

                      {/* Title + Price */}
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
                ))
              )}
            </div>
          </section>
        </MainWrapper>
      )}
    </main>
  );
}
