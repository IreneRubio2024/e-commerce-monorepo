import Link from "next/link";
import Image from "next/image";
import { Product } from "@repo/shared/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex flex-col col-span-12 px-8">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center col-span-12 mt-32 text-3xl font-extrabold tracking-wide ">
        <h1 className="text-3xl font-extrabold tracking-wide uppercase mb-[2rem] ">
          Products
        </h1>
      </div>

      {/* SEARCH */}
      <div className="col-span-12 flex  w-full mb-[1rem]">
        <Input type="text" placeholder="Search products..." className="" />
        {/* <svg
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
        </svg> */}
      </div>

      {/* MOBILE FILTER */}
      <div className="flex flex-col gap-[0.5rem] ">
        <Button
          variant={open ? "secondary" : "default"}
          onClick={() => setOpen(!open)}
          className="items-start justify-start "
        >
          {open ? "Close Filter" : "Filter"}
        </Button>

        {open && (
          <div className="flex flex-col customGap p-[1rem]  mt-[0.5rem] bg-secondary ">
            <span className="flex flex-col border-b border-dotted border-gray-300 pb-[1rem] ">
              <h3 className=" mb-[0.5rem] font-semibold text-sm">
                Availability
              </h3>
              <div className="flex items-center gap-[1rem]">
                <Checkbox
                  id="inStock"
                  checked={onlyInStock}
                  onCheckedChange={(checked) => setOnlyInStock(!!checked)}
                  className="aspect-square rounded-none"
                />
                <Label htmlFor="inStock" className="text-sm">
                  Show only in stock
                </Label>
              </div>
            </span>

            {/* Category buttons */}
          </div>
        )}

        {/* CATEGORY SCROLL */}
        <div className="sticky top-24 z-10 flex items-center justify-center overflow-x-auto py-2 gap-2 ">
          <Button
            variant={selectedCategory === null ? "default" : "secondary"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* PRODUCT LIST */}
        <div
          className={`grid gap-[1rem]  
            grid-cols-2 mt-[1rem]
          }`}
        >
          {filteredProducts.length === 0 ? (
            <div className="opacity-60 text-center col-span-full py-12">
              No products found
            </div>
          ) : (
            filteredProducts.map((p) => (
              <Card key={p.id} className="flex flex-col  rounded-none  ">
                <Link href={`/products/${p.slug}`}>
                  {p.media?.[0] && (
                    <Image
                      src={p.media[0]}
                      alt={p.title}
                      width={265}
                      height={314}
                      className="w-full object-cover border-b mb-[1rem]"
                    />
                  )}
                  <CardContent className="flex flex-col px-[1rem]">
                    <p className="mb-[0.5rem] text-xs">{p.category}</p>
                    <div className="flex flex-col justify-start items-start ">
                      <h3 className="font-semibold mb-[0.5rem]">{p.title}</h3>

                      <h3 className="text-sm">${p.price}</h3>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
