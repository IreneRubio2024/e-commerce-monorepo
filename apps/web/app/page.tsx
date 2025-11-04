"use client";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false); // mobile toggle
  const [isMobile, setIsMobile] = useState(true);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Check screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setOpen(false); // mobile starts closed
      } else {
        setIsMobile(false);
        setOpen(true); // desktop starts open
      }
    };

    handleResize(); // run on mount
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

  return (
    <main className="min-h-screen bg-white">
      <Navbar open={open} setOpen={setOpen} />

      {/* Header */}
      <div className="flex flex-col justify-center items-center mt-[123px] gap-2">
        <h1 className="block lg:hidden text-3xl font-extrabold tracking-wide">
          Products
        </h1>

        <div className="flex lg:hidden w-full p-6">
          {/* Search (only mobile) */}
          <div className="flex items-center justify-between  w-full p-3 rounded-md bg-gray-300">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full text-left text-base  outline-none "
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
        </div>
      </div>

      {/* Filter & Categories */}
      <div className="px-4 mt-4 flex flex-col gap-2 relative w-full">
        <div className={`flex gap-4 ${open ? "flex-row" : "flex-col"}   `}>
          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={() => setOpen(!open)}
              className="flex justify-start gap-[9px] items-center w-1/2 text-lg font-semibold pr-[3px]"
            >
              Filter <span> {open ? "<" : ">"}</span>
            </button>
          )}

          {/* Category Scroll */}
          <div className=" flex lg:hidden overflow-x-auto gap-2 py-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                className="flex-shrink-0 border px-3 py-1 rounded-md shadow-sm text-sm"
              >
                {cat} category
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid + Filter Panel */}
      <div className="px-4 mt-4 w-full flex gap-4">
        {/* Filter Panel */}
        {(open || !isMobile) && (
          <div className="w-1/2 lg:w-1/4 bg-white shadow-md p-4 flex-shrink-0">
            <h2 className="hidden lg:block text-xl font-semibold mb-2">
              Filter
            </h2>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex justify-start mb-4 gap-4">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  className="border px-2 py-1 shadow-sm rounded-md"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <div className="hidden lg:flex flex-col">
            <span className="flex opacity-60 text-sm gap-2 font-semibold">
              <Link href="/" className="">
                Home
              </Link>
              /
              <Link href="/" className="opacity-30">
                Products
              </Link>
            </span>
            <h1 className=" text-3xl font-extrabold tracking-wide uppercase">
              Products
            </h1>
          </div>
          <div className="hidden lg:grid grid-cols-3 gap-4 ">
            {/* SEARCH DESKTOP */}
            <div className="flex items-center justify-between bg-gray-300 w-full p-3 rounded-md">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-left text-base bg-transparent outline-none"
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
            <div className="pl-[3px] flex overflow-x-auto gap-2 py-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 border px-3 py-1 rounded-md shadow-sm text-sm"
                >
                  {cat} category
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid gap-4 flex-1 ${
              open && isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {products.map((p) => (
              <Link
                href={`/products/${p.slug}`}
                key={p.id}
                className="border p-4 rounded-md shadow-sm"
              >
                {p.media[0] && (
                  <img
                    src={p.media[0]}
                    alt={p.title}
                    className="w-full object-cover rounded-md"
                  />
                )}
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-gray-700 mt-1">{p.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">${p.price}</span>
                  <span className="text-sm text-gray-500">
                    {p.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
