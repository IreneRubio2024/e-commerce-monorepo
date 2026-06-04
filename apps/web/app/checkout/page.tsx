"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "app/components/cart/CartProvider";
import { createOrder, OrderItem } from "@repo/shared/orders";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [order, setOrder] = useState<{ id: number; total: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    // If navigating here after CartDrawer checkout
    if (orderIdParam && items.length) {
      const total = items.reduce(
        (sum, it) => sum + it.product.price * it.quantity,
        0
      );
      setOrder({ id: parseInt(orderIdParam), total });
    }
  }, [orderIdParam, items]);

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  const handleCreateOrder = async () => {
    if (!items.length) return;
    setLoading(true);

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

      setOrder({ id: newOrder.data.id, total });
      router.push(`/checkout?orderId=${newOrder.data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (details: any) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`);
    if (!order) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { orderStatus: "paid" } }),
    });

    setPaid(true);
    clearCart();
  };

  if (!order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="p-8"
      >
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Button className="" onClick={handleCreateOrder}>
          {loading ? "Creating Order..." : "Start Checkout"}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-start justify-start w-full"
    >
      <span className=" flex flex-col customGap px-8 mt-8 pb-8 lg:px-16 lg:pb-0  w-full">
        <Link href="/">
          <svg
            width="49"
            height="14"
            viewBox="0 0 49 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M48.25 6.75H0.75M0.75 6.75L6.75 0.75M0.75 6.75L6.75 12.75"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </span>
      <div className="flex flex-col lg:flex-row customGap px-0 mt-0 pb-8 lg:px-16 lg:pt-16 w-full">
        {/* LEFT SIDE: Form + Payment */}
        <div className="flex-1 customGap">
          {/* Information */}
          <section className="flex flex-col border p-[2rem] rounded gap-[1rem]">
            <h2 className="font-semibold">Information</h2>
            <Input
              type="text"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="  bg-gray-300"
            />
            <Input
              type="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="  bg-gray-300"
            />
            <Input
              type="text"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="  bg-gray-300"
            />
            <Input
              type="text"
              placeholder="City"
              value={shippingInfo.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="   bg-gray-300"
            />
            <Input
              type="text"
              placeholder="Postal Code"
              value={shippingInfo.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="  bg-gray-300"
            />
            <Input
              type="text"
              placeholder="Country"
              value={shippingInfo.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className=" bg-gray-300"
            />
          </section>

          {/* Shipping */}
          <section className="border p-[2rem] ">
            <h2
              className=" 
            font-semibold mb-[1rem]"
            >
              Shipping
            </h2>
            <p>Standard shipping: 5-7 business days</p>
            <p>Free shipping for orders over $100</p>
          </section>

          {/* Payment */}
          {!paid && (
            <section className="flex flex-col border p-[2rem] gap-[1rem] rounded">
              <h2 className=" font-semibold mb-[1rem]">Payment</h2>
              <PayPalScriptProvider
                options={{
                  clientId:
                    "AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu",
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  createOrder={(_data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        { amount: { currency_code: "USD", value: order.total.toFixed(2) } },
                      ],
                    });
                  }}
                  onApprove={(_data, actions) => {
                    return actions.order!.capture().then(handleApprove);
                  }}
                />
              </PayPalScriptProvider>
            </section>
          )}

          {paid && (
            <div className="p-[2rem] border text-green-600 font-semibold">
              Payment Successful! Thank you for your order.
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Cart */}
        <div className="w-full lg:w-96 border p-[2rem] rounded space-y-[1rem]">
          <h2 className="font-semibold">Your Cart</h2>
          {items.length === 0 ? (
            <p className=" opacity-60">Your cart is empty</p>
          ) : (
            items.map((it) => (
              <div key={it.product.id} className="flex gap-3 items-center">
                {it.product.media?.[0] ? (
                  <Image
                    src={it.product.media[0]}
                    alt={it.product.title}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{it.product.title}</div>
                  <div className="text-sm opacity-60">
                    ${it.product.price.toFixed(2)}
                  </div>
                  <div className="text-sm opacity-60">Qty: {it.quantity}</div>
                </div>
              </div>
            ))
          )}
          <div className="border-t pt-[1rem] mt-[1rem] flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
