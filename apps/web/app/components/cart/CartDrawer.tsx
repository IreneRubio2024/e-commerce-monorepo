"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCart } from "./CartProvider";
import { createOrder, OrderItem } from "@repo/shared/orders";
import RetryImage from "../RetryImage";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQty, removeItem, itemCount, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    setMessage(null);

    try {
      const orderItems: OrderItem[] = items.map((it) => ({
        product: [it.product.id],
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

      router.push(`/checkout?orderId=${newOrder.data?.id}`);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed top-0 right-0 h-full w-full lg:w-96 bg-white shadow-md z-50 border-l-none lg:border-l flex flex-col"
        >
          {/* Header */}
          <div className="p-8 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shopping Cart ({itemCount})</h3>
            <Button onClick={onClose}>Close</Button>
          </div>

          {/* Items */}
          <div
            className="p-8 overflow-auto flex-1"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {items.length === 0 ? (
              <div className="text-center opacity-60 py-8">Your cart is empty</div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((it) => (
                  <motion.div
                    key={it.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-4 border p-4 rounded items-start"
                  >
                    {/* Image */}
                    <div className="relative w-full h-40 col-span-1">
                      {it.product.media?.[0] ? (
                        <RetryImage
                          src={it.product.media[0]}
                          alt={it.product.title}
                          fill
                          className="object-contain object-left rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between col-span-1 col-start-2 h-full">
                      <div>
                        <div className="font-semibold">{it.product.title}</div>
                        <div className="text-sm opacity-60">
                          ${it.product.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-y-[1rem]">
                        <Button
                          variant="secondary"
                          onClick={() => updateQty(it.product.id, it.quantity - 1)}
                        >
                          -
                        </Button>
                        <div className="px-[1rem]">{it.quantity}</div>
                        <Button
                          variant="secondary"
                          onClick={() => updateQty(it.product.id, it.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => removeItem(it.product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-[2rem] border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm opacity-70">Subtotal</div>
              <div className="font-semibold">${subtotal.toFixed(2)}</div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleCheckout}
                disabled={loading || !items.length}
              >
                {loading ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
