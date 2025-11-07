"use client";

import { use, useEffect, useState } from "react";
import { fetchProduct, type Product } from "@repo/shared/products";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/cart/CartProvider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProduct(slug);
        setProduct(data);

        // Use main image from `media`, fallback to first detailed image
        setSelectedImage(data?.media?.[0] || data?.detailMedia?.[0] || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <main className="bg-white min-h-screen">
      <Navbar open={open} setOpen={setOpen} />

      <div className="grid grid-cols-12 customGap h-full px-0 mt-0 pb-8 lg:px-16 lg:pt-32">
        {/* ---------- LEFT SIDE: Image + Thumbnails ---------- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col lg:flex-row-reverse items-start customGap relative h-full">
          {/* Main Image */}
          <div className="relative flex-1 w-full h-[60vh] lg:h-[80vh] rounded-md overflow-hidden">
            <Image
              src={
                selectedImage?.includes("http")
                  ? selectedImage
                  : `/api/images/${selectedImage}`
              }
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Thumbnail list */}
          {product.detailMedia?.length > 0 && (
            <div className="flex lg:flex-col gap-2 p-4 lg:p-0 lg:mr-4 overflow-x-auto lg:overflow-y-auto">
              {product.detailMedia.map((img: string, i: number) => (
                <div
                  key={i}
                  className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md border transition ${
                    selectedImage === img ? "border-black" : "border-gray-300"
                  } hover:border-black`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.title} detail ${i + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 p-4 lg:p-0 flex items-start">
          <Card className="border w-full">
            <CardContent className="flex flex-col gap-6 p-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">{product.title}</h1>
                <p className="text-xl font-semibold">
                  ${product.price?.toLocaleString("en-US")}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              <p
                className={`text-sm ${
                  product.inStock ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </p>

              <Button
                onClick={handleAddToCart}
                disabled={added}
                className={`transition ${
                  added
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {added ? "ADDED ✓" : "ADD TO CART"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
