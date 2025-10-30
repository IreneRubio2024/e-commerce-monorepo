"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inStock: boolean;
  slug: string;
  media: string[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:1337/api/products?populate=media";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();
        console.log("Raw Strapi JSON:", json);

        const fetchedProducts: Product[] = json.data.map((item: any) => {
          const attrs = item;

          // Map all media URLs
          const mediaUrls: string[] =
            attrs.media
              ?.map((m: any) =>
                m?.url
                  ? m.url.startsWith("http")
                    ? m.url
                    : `http://localhost:1337${m.url}`
                  : ""
              )
              .filter(Boolean) || [];

          return {
            id: attrs.id,
            title: attrs.title || "No title",
            description: attrs.description || "",
            price: attrs.price || 0,
            inStock: attrs.inStock ?? false,
            slug: attrs.slug || "",
            media: mediaUrls,
          };
        });

        setProducts(fetchedProducts);
        console.log("Simplified Products:", fetchedProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Products</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
            }}
          >
            {p.media.length > 0 && (
              <img
                src={p.media[0]}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "auto",
                  marginBottom: "0.5rem",
                }}
              />
            )}
            <h2 style={{ fontSize: "1rem", margin: "0 0 0.5rem 0" }}>
              {p.title}
            </h2>
            <p style={{ margin: "0 0 0.5rem 0" }}>${p.price}</p>
            <p
              style={{ fontSize: "0.8rem", color: p.inStock ? "green" : "red" }}
            >
              {p.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
