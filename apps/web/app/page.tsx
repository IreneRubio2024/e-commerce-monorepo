"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const categories = Array.from(new Set(products.map((p) => p.category)));

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
    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchesStock = onlyInStock ? p.inStock : true;
    return matchesCategory && matchesStock;
  });

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />
      <main className="layout min-h-screen bg-white">
        {/* Header */}

        <div className="flex flex-col items-center justify-center lg:hidden col-span-12 lg:col-span-2 col-start-1 lg:col-start-4 mt-[123px] text-3xl font-extrabold tracking-wide">
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

        {/* Search (only mobile) */}
        <div className="col-span-12 flex lg:hidden w-full">
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

        {/* Filter & Categories */}
        <div className="col-span-12 lg:col-span-9 col-start-1 lg:col-start-4 mt-0 lg:mt-[123px] flex flex-col relative w-full">
          <div className={`flex flex-col`}>
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <button
                onClick={() => setOpen(!open)}
                className="flex justify-start gap-[9px] items-center text-lg font-semibold pr-[3px] w-full"
              >
                Filter <span> {open ? "<" : ">"}</span>
              </button>
            )}

            {/* Category Scroll */}
            <div className=" flex lg:hidden overflow-x-auto gap-2 py-2 text-[10px] uppercase">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`h-[24px] w-[100px] border ${!selectedCategory ? "bg-black text-white" : ""}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-[24px] w-[100px] border ${selectedCategory === cat ? "bg-black text-white" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {(open || !isMobile) && (
          <div
            className={`${open ? "col-span-6" : "w-full"} col-span-12 lg:col-span-4 col-start-1 bg-white  p-4`}
          >
            <h2 className="hidden lg:block text-xl font-semibold mb-[32px]">
              Filter
            </h2>
            <div className="flex flex-col">
              {/* SIZE */}
              {/* <span className="flex flex-col gap-[14px] mb-[32px]">
                <h3 className="">Size</h3>
                <div className="flex justify-start gap-[4px] pb-[18px] border-b border-dotted border-gray-300 ">
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      className="border  shadow-sm  w-[38px] text-[14px] aspect-square"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </span> */}

              {/* AVAILABILITY  */}
              <span className="flex flex-col  pb-[14px] border-b border-dotted border-gray-300 mb-[32px]">
                <h3 className="mb-[18px]">Availability</h3>
                <div className="flex items-center gap-[9px] ">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-[22px] aspect-square rounded-none"
                  />
                  <label htmlFor="inStock" className="text-sm">
                    Show only in stock
                  </label>
                </div>
              </span>
            </div>
          </div>
        )}

        <div className="col-span-12 lg:col-span-8 col-start-1 lg:col-start-5 flex flex-col">
          {/* BREADCRUMB ONLY DESKTOP */}
          <div className="hidden lg:flex flex-col gap-[32px]">
            <span className="flex opacity-60 text-sm gap-2 font-semibold">
              <Link href="/" className="">
                Home
              </Link>
              /
              <Link href="/" className="opacity-30">
                Products
              </Link>
            </span>
            <h1 className=" text-3xl font-extrabold tracking-wide uppercase mb-[32px]">
              Products
            </h1>
          </div>
          {/* SEARCH DESKTOP */}
          <div className="hidden lg:grid grid-cols-9 gap-[40px] w-full h-[50px]">
            <div className="flex items-center justify-between col-start-1 col-span-4  bg-gray-300  p-3 ">
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
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-right text-base bg-transparent outline-none"
              />
            </div>
            <div className=" col-start-5 col-span-5  flex flex-wrap gap-x-[14px] gap-y-[2px]  overflow-x-auto w-full text-[10px] uppercase ">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`h-[24px] w-[100px] border ${!selectedCategory ? "bg-black text-white" : ""}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-[24px] w-[100px] border ${selectedCategory === cat ? "bg-black text-white" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid gap-[40px] mt-[40px] ${
              open && isMobile
                ? "w-1/2 grid-cols-1"
                : "w-full grid-cols-2 lg:grid-cols-3"
            }`}
          >
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
                        className="w-full object-cover border mb-[14px]"
                      />
                    </Link>
                  )}
                  <div className="flex flex-col">
                    <p className="mb-[12px]">{p.category}</p>
                    <div className="flex justify-between items-center mb-[14px]">
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
        </div>
      </main>
    </>
  );
}
