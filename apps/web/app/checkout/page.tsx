"use client";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import React, { useState } from "react";

interface CheckoutProps {
  order: {
    id: number;
    total: number;
  };
}

function Checkout({ order }: CheckoutProps) {
  const [{ options, isPending }, dispatch]: any = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options?.currency || "USD");

  const onCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: { ...options, currency: value },
    });
  };

  const onCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: order.total.toFixed(2) },
        },
      ],
    });
  };

  const onApproveOrder = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      const name = details.payer.name.given_name;
      alert(`Transaction completed by ${name}`);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { orderStatus: "paid" } }),
      });
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <>
          <select value={currency} onChange={onCurrencyChange}>
            <option value="USD">💵 USD</option>
            <option value="EUR">💶 Euro</option>
          </select>

          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={onCreateOrder}
            onApprove={onApproveOrder}
          />
        </>
      )}
    </div>
  );
}
export default function CheckoutPage({
  order,
}: {
  order: { id: number; total: number };
}) {
  const initialOptions = {
    "client-id":
      "AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu",
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions as any}>
      <Checkout order={order} />
    </PayPalScriptProvider>
  );
}
