import { Product } from "@repo/shared/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import RetryImage from "./RetryImage";
import Link from "next/link";

type MobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  filteredProducts: Product[];
  onlyInStock: boolean;
  setOnlyInStock: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
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
  searchQuery,
  setSearchQuery,
  loading,
}: MobileProps) {
  return (
    <div className="flex flex-col col-span-12  min-h-screen">
      <div className="flex flex-col col-span-12 px-8 min-h-screen">
        <div className="flex flex-col items-center mt-32 text-3xl font-extrabold tracking-wide">
          <h1 className="uppercase mb-8">Products</h1>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex flex-col">
          {/* STICKY CATEGORY + FILTER */}
          <div className="sticky top-24 z-10  flex flex-col gap-[1rem]  w-full">
            <div className="flex w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8 bg-secondary w-full"
              />
            </div>
            {/* CATEGORY BUTTONS */}
            <div className="flex items-start justify-start gap-[1rem]   overflow-x-auto w-full">
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 mt-2 bg-secondary p-4 rounded-md border border-gray-200"
              >
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
              </motion.div>
            )}
          </div>

          {/* PRODUCT LIST */}
          <div className=" mt-4 mb-8 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem] w-full"
            >
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
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      ease: "easeInOut",
                      duration: 0.6,
                    }}
                    className="w-full"
                  >
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
                        <p className="text-sm text-gray-500">{p.category}</p>
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
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
