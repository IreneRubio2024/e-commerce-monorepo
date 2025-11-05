import Link from "next/link";
import Image from "next/image";
import { Product } from "@repo/shared/products";

type MobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  filteredProducts: Product[];
  onlyInStock: boolean;
  setOnlyInStock: (value: boolean) => void;
};

export default function MobileProductPageLayout({
  open,
  setOpen,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  onlyInStock,
  setOnlyInStock,
}: MobileProps) {
  return (
    <div className="flex flex-col col-span-12">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center col-span-12 mt-[7.7rem] text-3xl font-extrabold tracking-wide ">
        <span className="flex opacity-60 text-xs gap-2 font-semibold tracking-normal">
          <Link href="/">Home</Link> /{" "}
          <Link href="/" className="opacity-30">
            Products
          </Link>
        </span>
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mb-5">
          Products
        </h1>
      </div>

      {/* SEARCH */}
      <div className="col-span-12 flex  w-full">
        <div className="flex items-center justify-between w-full p-3  bg-gray-300">
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
      </div>

      {/* MOBILE FILTER */}
      <div className="flex flex-col mt-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-start gap-[0.56rem] items-center text-lg font-semibold pr-[0.19rem] w-full"
        >
          Filter <span>{open ? "<" : ">"}</span>
        </button>

        {open && (
          <div className="flex flex-col mt-6">
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
        )}

        {/* CATEGORY SCROLL */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 text-[0.625rem] uppercase">
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

        {/* PRODUCT LIST */}
        <div
          className={`grid gap-10 mt-2  
            grid-cols-2
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
      </div>
    </div>
  );
}
