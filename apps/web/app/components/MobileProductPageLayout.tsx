import { Product } from "@repo/shared/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";



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
                initial={{ opacity: 0,  }}
                animate={{ opacity: 1,  }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                exit={{ opacity: 0,  }}
                className="flex flex-col gap-4 mt-2 bg-secondary p-4 rounded-md border border-gray-200">
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
            <ProductGrid filteredProducts={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
