"use client";

import { use, useEffect, useState } from "react";
import { fetchProduct, type Product } from "@repo/shared/products";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/cart/CartProvider";
<<<<<<< Updated upstream
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
=======
import { Product } from "@repo/shared/products";
import { trackProductView, trackAddToCart } from "../../lib/analytics";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProduct(slug);
        setProduct(data);
        setSelectedImage(data?.detailMedia?.[0] || null);

        // 🎯 Track product view when product loads
        if (data) {
          trackProductView(
            data.id.toString(),
            data.title,
            data.price
          );
        }
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

    const cartProduct: Product = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      inStock: product.inStock,
      slug: product.slug,
      media: product.media || [],
      detailMedia: product.detailMedia || [],
      category: product.category || "Uncategorized",
    };

    addItem(product, 1);

    // 🎯 Track add to cart event
    trackAddToCart(
      product.id.toString(),
      product.title,
      product.price,
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

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
                className={`w-20 h-24 object-cover rounded-md cursor-pointer border ${selectedImage === img ? "border-black" : "border-gray-300"
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
          <p className=" text-gray-500">
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-3 rounded font-medium transition ${added
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-black hover:text-white"
              }`}
          >
            {added ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </main>
  );
}
/* "use client";

import { use, useEffect, useState } from "react";
import { fetchProduct } from "@repo/shared/products";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/cart/CartProvider";
import { Product } from "@repo/shared/products";
>>>>>>> Stashed changes

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

        const allImages = [...(data.media || []), ...(data.detailMedia || [])];
        setSelectedImage(allImages[0] || null);
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
                className={`relative w-20 h-20  cursor-pointer rounded-md border transition ${
                  selectedImage === img ? "border-black" : "border-gray-300"
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
