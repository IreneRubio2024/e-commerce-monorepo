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

export interface StrapiOrderResponse {
  data: {
    id: number;
    attributes: {
      total: number;
      orderStatus: string;
      items: any[];
      createdAt: string;
      updatedAt: string;
      publishedAt?: string;
    };
  };
  meta?: Record<string, any>;
}

const STRAPI_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337";

const API_URL = `${STRAPI_URL}/api/orders`;

export async function createOrder(order: Order): Promise<StrapiOrderResponse> {
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
<<<<<<< Updated upstream
}

export async function updateOrderStatus(
  orderId: number,
  status: Order["orderStatus"]
): Promise<StrapiOrderResponse> {
  const res = await fetch(`${API_URL}/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { orderStatus: status } }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update order: ${err}`);
  }

  return res.json();
}
=======
}
>>>>>>> Stashed changes
