"use client";

import { use, useEffect, useState } from "react";
import { fetchProduct, type Product } from "@repo/shared/products";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/cart/CartProvider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackProductView, trackAddToCart } from "../../lib/analytics";

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

        // Combine media + detailMedia for thumbnails
        const allImages = [
          ...(data?.media || []),
          ...(data?.detailMedia || []),
        ];
        setSelectedImage(allImages[0] || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [slug]);

  // Add this useEffect to track product views
  useEffect(() => {
    if (product) {
      trackProductView(
        String(product.id ?? slug),
        product.title,
        product.price
      );
    }
  }, [product, slug]);

  const handleAddToCart = () => {
    if (!product) return;

    // Track the add to cart event
    trackAddToCart(
      String(product.id ?? slug),
      product.title,
      product.price,
      1
    );

    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <main className="bg-white min-h-screen">
      <Navbar open={open} setOpen={setOpen} />

      <div className="grid grid-cols-12 customGap h-full px-0 pt-0 pb-8 lg:px-16 lg:pt-32">
        {/* ---------- LEFT SIDE: Image + Thumbnails ---------- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col lg:flex-row-reverse items-start customGap relative h-full">
          {/* Main Image */}
          <div
            className={`relative w-full rounded-md overflow-hidden 
    min-h-[60vh] `}
          >
            {selectedImage && (
              <Image
                src={
                  selectedImage.includes("http")
                    ? selectedImage
                    : `/api/images/${selectedImage}`
                }
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
          <div className="flex px-8 lg:px-0 lg:flex-col gap-[1rem]">
            {/* Thumbnail list */}
            {product.media.concat(product.detailMedia).map((img, i) => (
              <div
                key={i}
                className={`relative w-20 h-20  cursor-pointer rounded-md border transition ${selectedImage === img ? "border-black" : "border-gray-300"
                  } hover:border-black`}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.title} detail ${i + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 px-8 lg:p-0 flex items-start">
          <Card className="border w-full">
            <CardContent className="flex flex-col gap-[1rem] p-8 ">
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
                className={`text-sm ${product.inStock ? "text-green-600" : "text-red-500"
                  }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </p>

              <Button
                onClick={handleAddToCart}
                disabled={added}
                className={`transition ${added
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
