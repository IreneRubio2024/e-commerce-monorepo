"use client";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetched = await fetchProducts();
      setProducts(fetched);
      console.log("Products:", fetched);
    };
    loadProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map((p) => (
        <div key={p.id}>
          <Link href={`/${p.slug}`}>
            <h3>{p.title}</h3>
          </Link>

          {p.media[0] && <img src={p.media[0]} alt={p.title} width={200} />}
          <p>{p.description}</p>
          <p>{p.price}kr</p>
          <p>{p.inStock ? "In stock" : "Out of stock"}</p>
          <p className="text-sm text-gray-500">
            Category: {p.category || "Uncategorized"}
          </p>
        </div>
      ))}
    </div>
  );
}
