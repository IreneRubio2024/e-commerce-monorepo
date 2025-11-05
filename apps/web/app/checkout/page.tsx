import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import React, { useState } from "react";

function Checkout() {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "8.99",
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
      alert(`Transaction completed by ${name}`);
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
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApproveOrder(data, actions)}
          />
        </>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const initialOptions = {
    "client-id": "AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu",
    currency: "USD",
    intent: "capture",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <Checkout />
    </PayPalScriptProvider>
  );
}
