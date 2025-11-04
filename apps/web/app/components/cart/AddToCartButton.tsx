// components/cart/AddToCartButton.tsx
"use client";
import React from "react";
import { Product } from "@repo/shared/products";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCart();

    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // if inside a Link or clickable parent
                addItem(product, 1);
            }}
            disabled={!product.inStock}
            className={`w-full py-2 rounded ${product.inStock ? "bg-black text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
        >
            Add to cart
        </button>
    );
}
