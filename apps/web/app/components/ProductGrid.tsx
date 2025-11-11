"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Product } from "@repo/shared/products";
import { motion } from "framer-motion";


export default function ProductGrid({
  filteredProducts,
}: {
  filteredProducts: Product[];
}) {
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
   className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem] w-full">
      {filteredProducts.length === 0 ? (
        <div className="opacity-60 text-center col-span-full">
          No products found
        </div>
      ) : (
        filteredProducts.map((p, i) => (
            <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease: "easeInOut", duration: 0.6,  }}
            className="w-full">
          <Card className="rounded-none border-none">
            {p.media?.[0] && (
              <Link href={`/products/${p.slug}`}>
                <Image
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
                <span className="text-base font-semibold">${p.price}</span>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
