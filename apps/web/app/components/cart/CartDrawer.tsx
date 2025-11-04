// components/cart/CartDrawer.tsx
"use client";
import React from "react";
import { useCart } from "./CartProvider";
import Image from "next/image";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { items, updateQty, removeItem, itemCount, subtotal } = useCart();

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full lg:w-96 bg-white shadow-xl transform transition-transform z-50 ${open ? "translate-x-0" : "translate-x-full"
                }`}
            aria-hidden={!open}
        >
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Shopping Cart ({itemCount})</h3>
                <button onClick={onClose} className="text-sm opacity-70">Close</button>
            </div>

            <div className="p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
                {items.length === 0 ? (
                    <div className="text-center opacity-60 py-8">Your cart is empty</div>
                ) : (
                    items.map((it) => (
                        <div key={it.product.id} className="flex gap-3 items-center mb-4">
                            {it.product.media?.[0] ? (
                                // keep it simple: use <img> so not to require next/image remote config
                                <img src={it.product.media[0]} alt={it.product.title} className="w-16 h-16 object-cover rounded" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded" />
                            )}
                            <div className="flex-1">
                                <div className="font-semibold">{it.product.title}</div>
                                <div className="text-sm opacity-60">${it.product.price.toFixed(2)}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        onClick={() => updateQty(it.product.id, it.quantity - 1)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        -
                                    </button>
                                    <div className="px-2">{it.quantity}</div>
                                    <button
                                        onClick={() => updateQty(it.product.id, it.quantity + 1)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => removeItem(it.product.id)}
                                        className="ml-auto text-sm opacity-60"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                    <div className="text-sm opacity-70">Subtotal</div>
                    <div className="font-semibold">${subtotal.toFixed(2)}</div>
                </div>

                <div className="mt-4">
                    <button className="w-full py-2 rounded bg-black text-white">Checkout</button>
                </div>
            </div>
        </div>
    );
}
