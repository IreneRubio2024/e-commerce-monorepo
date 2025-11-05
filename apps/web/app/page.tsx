"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";
import MobileProductPageLayout from "./components/MobileProductPageLayout";

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
    <main className="layout min-h-screen bg-white">
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
        // DESKTOP LAYOUT
        <div className="col-span-12 grid lg:grid-cols-12 lg:gap-10 mt-[7.7rem]">
          {/* Sidebar / Filter */}
          <aside className="col-span-4 flex flex-col bg-white p-4">
            <h2 className="text-xl font-semibold mb-8">Filter</h2>
            <div className="flex flex-col">
              <span className="flex flex-col pb-[0.875rem] border-b border-dotted border-gray-300 mb-8">
                <h3 className="mb-[1.125rem]">Availability</h3>
                <div className="flex items-center gap-[0.56rem]">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-[1.375rem] aspect-square rounded-none"
                  />
                  <label htmlFor="inStock" className="text-sm">
                    Show only in stock
                  </label>
                </div>
              </span>

              {/* Category buttons */}
            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-8 flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
              <span className="flex opacity-60 text-sm gap-2 font-semibold">
                <Link href="/">Home</Link> /{" "}
                <Link href="/" className="opacity-30">
                  Products
                </Link>
              </span>
              <h1 className="text-3xl font-extrabold tracking-wide uppercase">
                Products
              </h1>
            </div>
            <div className=" flex flex-row w-full gap-10 ">
              <div className="flex items-center justify-between w-1/2 p-3 bg-gray-300 ">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-left text-base outline-none"
                />
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="5.97502"
                    cy="5.97502"
                    r="5.22502"
                    stroke="black"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M9.82495 9.82422L11.75 11.7492"
                    stroke="black"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.625rem] uppercase">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`h-[1.5rem] w-[6.25rem] border ${
                    !selectedCategory ? "bg-black text-white" : ""
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-[1.5rem] w-[6.25rem] border ${
                      selectedCategory === cat ? "bg-black text-white" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-3 gap-10 mt-10">
              {filteredProducts.length === 0 ? (
                <div className="opacity-60 text-center col-span-full py-12">
                  No products found
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="flex flex-col">
                    {p.media?.[0] && (
                      <Link href={`/products/${p.slug}`}>
                        <Image
                          src={p.media[0]}
                          alt={p.title}
                          width={265}
                          height={314}
                          className="w-full object-cover border mb-[0.875rem]"
                        />
                      </Link>
                    )}
                    <div className="flex flex-col">
                      <p className="mb-[0.75rem]">{p.category}</p>
                      <div className="flex justify-between items-center mb-[0.875rem]">
                        <Link href={`/products/${p.slug}`}>
                          <h3>{p.title}</h3>
                        </Link>
                        <h3>${p.price}</h3>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
