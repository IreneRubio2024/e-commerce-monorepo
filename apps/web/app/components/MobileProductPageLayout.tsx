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
    <div className="flex flex-col col-span-12  min-h-screen">
      {/* HEADER */}

      <div className="flex flex-col col-span-12 px-8 min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col items-center mt-32 text-3xl font-extrabold tracking-wide">
          <h1 className="uppercase mb-8">Products</h1>
        </div>

        {/* SEARCH */}
        <div className="flex w-full mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            className="flex-1"
          />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex flex-col">
          {/* STICKY CATEGORY + FILTER */}
          <div className="sticky top-24 z-10  flex flex-col gap-2  w-full">
            {/* CATEGORY BUTTONS */}
            <div className="flex items-start justify-start gap-[0.5rem]   overflow-x-auto w-full">
              <div className="flex items-start justify-start w-full gap-0">
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
              <Button
                variant="default"
                className="w-full"
                onClick={() => setOpen(!open)}
              >
                {open ? "Close" : "Filter"}
              </Button>
            </div>

            {/* FILTER PANEL */}
            {open && (
              <div className="flex flex-col gap-4 mt-2 bg-secondary p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-4">
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
              </div>
            )}
          </div>

          {/* PRODUCT LIST */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {filteredProducts.length === 0 ? (
              <div className="opacity-60 text-center col-span-full py-12">
                No products found
              </div>
            ) : (
              filteredProducts.map((p) => (
                <Card key={p.id} className="flex flex-col rounded-none">
                  <Link href={`/products/${p.slug}`}>
                    {p.media?.[0] && (
                      <Image
                        src={p.media[0]}
                        alt={p.title}
                        width={265}
                        height={314}
                        className="w-full object-cover border-b mb-2"
                      />
                    )}
                    <CardContent className="flex flex-col px-4">
                      <p className="mb-1 text-xs">{p.category}</p>
                      <h3 className="font-semibold mb-1">{p.title}</h3>
                      <h3 className="text-sm">${p.price}</h3>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
