"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { createOrder, OrderItem } from "@repo/shared/orders";
import Image from "next/image";
import { Button } from "@/components/ui/button";


export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQty, removeItem, itemCount, subtotal, clearCart } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    setMessage(null);

    try {
      const orderItems: OrderItem[] = items.map((it) => ({
        product: [it.product.id], // array of numeric IDs
        quantity: it.quantity,
        price: it.product.price,
      }));

      const total = items.reduce(
        (sum, it) => sum + it.product.price * it.quantity,
        0
      );

      const newOrder = await createOrder({
        items: orderItems,
        total,
        orderStatus: "pending",
      });

      console.log("Order ID:", newOrder.data?.id);

      const orderStatus = newOrder.data?.attributes?.orderStatus ?? "unknown";
      console.log("Order Status:", orderStatus);

      router.push(`/checkout?orderId=${newOrder.data?.id}`);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full lg:w-96 bg-white shadow-xl transform transition-transform z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="p-[2rem] border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shopping Cart ({itemCount})</h3>
        <Button onClick={onClose} className="">
          Close
        </Button>
      </div>

      <div
        className="p-4 overflow-auto"
        style={{ maxHeight: "calc(100vh - 160px)" }}
      >
        {items.length === 0 ? (
          <div className="text-center opacity-60 py-8">Your cart is empty</div>
        ) : (
          items.map((it) => (
            <div key={it.product.id} className="flex customGap items-center mb-[2rem]">
              {it.product.media?.[0] ? (
          
                <Image
                  src={it.product.media[0]}
                  alt={it.product.title}
                  width={265}
                  height={314}
                  className=" object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{it.product.title}</div>
                <div className="text-sm opacity-60">
                  ${it.product.price.toFixed(2)}
                </div>
                <div className="mt-[1rem] flex items-center customGap">
                  <Button
                    onClick={() => updateQty(it.product.id, it.quantity - 1)}
                    className=""
                  >
                    -
                  </Button>
                  <div className="px-[1rem]">{it.quantity}</div>
                  <Button
                    onClick={() => updateQty(it.product.id, it.quantity + 1)}
                    className=""
                  >
                    +
                  </Button>

                  <Button
                    onClick={() => removeItem(it.product.id)}
                    className=""
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-[2rem] border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm opacity-70">Subtotal</div>
          <div className="font-semibold">${subtotal.toFixed(2)}</div>
        </div>

        <div className="mt-4">
          <Button
            onClick={handleCheckout}
            disabled={loading || !items.length}
            className=""
          >
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
