"use client";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";

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

  return (
    <main className="layout min-h-screen bg-white">
      <Navbar open={open} setOpen={setOpen} />

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
        <div className={`flex  ${open ? "flex-row" : "flex-col"}   `}>
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

      {/* Filter Panel */}
      {(open || !isMobile) && (
        <div className=" col-span-12 lg:col-span-4 col-start-1 bg-white shadow-md p-4 ">
          <h2 className="hidden lg:block text-xl font-semibold mb-2">Filter</h2>
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="flex justify-start mb-4 gap-4">
            {["S", "M", "L", "XL"].map((s) => (
              <button key={s} className="border px-2 py-1 shadow-sm rounded-md">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="col-span-12 lg:col-span-8 col-start-1 lg:col-start-5 flex flex-col">
        {/* BREADCRUMB ONLY DESKTOP */}
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
        {/* SEARCH DESKTOP */}
        <div className="hidden lg:grid grid-cols-9 gap-[40px] w-full h-[50px]">
          <div className="flex col-start-1 col-span-4  bg-gray-300  p-3 rounded-md">
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
          <div className=" col-start-5 col-span-5  flex flex-wrap gap-[18px]  overflow-x-auto w-full ">
            {categories.map((cat, i) => (
              <button
                key={i}
                className=" p-[6px] border  rounded-md shadow-sm text-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`grid gap-[40px] ${
            open && isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {products.map((p) => (
            <Link
              href={`/products/${p.slug}`}
              key={p.id}
              className={` ${open && isMobile ? "col-span-1" : "col-span-1"} flex flex-col w-full `}
            >
              {p.media[0] && (
                <Image
                  src={p.media[0]}
                  alt={p.title}
                  width={265}
                  height={314}
                  className=" object-contain border"
                />
              )}
              <h2 className="text-base font-semibold">{p.title}</h2>
              <p className="text-gray-700 mt-1 text-sm">{p.description}</p>
              <div className="flex justify-between mt-2 w-full ">
                <span className="font-medium">${p.price}</span>
                <span className="text-sm text-gray-500">
                  {p.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
