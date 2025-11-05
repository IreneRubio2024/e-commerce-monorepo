"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "app/components/cart/CartProvider";
import { createOrder, OrderItem } from "@repo/shared/orders";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={handleCreateOrder}
        >
          {loading ? "Creating Order..." : "Start Checkout"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8">
      {/* LEFT SIDE: Form + Payment */}
      <div className="flex-1 space-y-8">
        {/* Information */}
        <section className="border p-4 rounded">
          <h2 className="">Information</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
          <input
            type="email"
            placeholder="Email"
            value={shippingInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
          <input
            type="text"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
          <input
            type="text"
            placeholder="City"
            value={shippingInfo.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={shippingInfo.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
          <input
            type="text"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full mb-3 p-3   bg-gray-300"
          />
        </section>

        {/* Shipping */}
        <section className="border p-4 rounded">
          <h2 className=" mb-4">Shipping</h2>
          <p>Standard shipping: 5-7 business days</p>
          <p>Free shipping for orders over $100</p>
        </section>

        {/* Payment */}
        {!paid && (
          <section className="border p-4 rounded">
            <h2 className=" mb-4">Payment</h2>
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu",
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      { amount: { value: order.total.toFixed(2) } },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(handleApprove);
                }}
              />
            </PayPalScriptProvider>
          </section>
        )}

        {paid && (
          <div className="p-4 border rounded text-green-600 font-semibold">
            Payment Successful! Thank you for your order.
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Cart */}
      <div className="w-full lg:w-96 border p-4 rounded space-y-4">
        <h2 className="">Your Cart</h2>
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
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
