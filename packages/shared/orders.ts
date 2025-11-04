export interface OrderItem {
  product: number[];
  quantity: number;
  price: number;
}

export interface Order {
  items: OrderItem[];
  total: number;
  orderStatus?: "pending" | "paid" | "shipped" | "completed" | "cancelled";
}

const STRAPI_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337";

const API_URL = `${STRAPI_URL}/api/orders`;

export async function createOrder(order: Order) {
  const formattedItems = order.items.map((item) => ({
    product: item.product, // numeric ID array
    quantity: item.quantity,
    price: item.price,
  }));

  const payload = {
    data: {
      items: order.items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        products: item.product,
      })),
      total: order.total,
      orderStatus: order.orderStatus || "pending",
    },
  };

  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create order: ${err}`);
  }

  return res.json();
}
