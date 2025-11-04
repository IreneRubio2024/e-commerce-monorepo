"use client";

import { use, useEffect, useState } from "react";
import { fetchProduct } from "@repo/shared/products";
import Navbar from "../../components/Navbar";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProduct(slug);
        setProduct(data);
        setSelectedImage(data?.detailMedia?.[0] || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <main className="min-h-screen bg-[#f9f9f9] p-6">
      <Navbar open={open} setOpen={setOpen} />

      <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex lg:flex-col gap-4 order-2 lg:order-1">
            {product.detailMedia?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} thumbnail ${i + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 object-cover rounded-md cursor-pointer border ${
                  selectedImage === img ? "border-black" : "border-gray-300"
                } hover:border-black transition`}
              />
            ))}
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <img
              src={selectedImage || product.detailMedia?.[0]}
              alt={product.title}
              className="w-full max-w-md object-cover rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl font-semibold mb-1">
            ${product.price?.toLocaleString("en-US")}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded hover:bg-black hover:text-white transition">
            ADD
          </button>
        </div>
      </div>
    </main>
  );
}
