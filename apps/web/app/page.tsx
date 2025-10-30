"use client";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@repo/shared/products";

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
          <h2>{p.title}</h2>
          {p.media[0] && <img src={p.media[0]} alt={p.title} width={200} />}
          <p>{p.description}</p>
          <p>{p.price}</p>
          <p>{p.inStock ? "In stock" : "Out of stock"}</p>
        </div>
      ))}
    </div>
  );
}
