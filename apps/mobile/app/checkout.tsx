import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useCart } from "./context/cart-Context-mobile";
import { createOrder, OrderItem } from "@repo/shared/orders";

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CartScreen({ navigation, route }: any) {
  const { items, clearCart } = useCart();
  const orderIdParam = route?.params?.orderId;

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

  const subtotal = items.reduce(
    (sum: number, it: { product: { price: number }; quantity: number }) =>
      sum + it.product.price * it.quantity,
    0
  );

  useEffect(() => {
    if (orderIdParam && items.length) {
      const total = items.reduce(
        (sum: number, it: { product: { price: number }; quantity: number }) =>
          sum + it.product.price * it.quantity,
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
      const orderItems: OrderItem[] = items.map(
        (it: { product: { id: number; price: number }; quantity: number }) => ({
          product: [it.product.id],
          quantity: it.quantity,
          price: it.product.price,
        })
      );

      const total = items.reduce(
        (sum: number, it: { product: { price: number }; quantity: number }) =>
          sum + it.product.price * it.quantity,
        0
      );

      const newOrder = await createOrder({
        items: orderItems,
        total, 
        orderStatus: "pending",
      });

      setOrder({ id: newOrder.data.id, total });
      Alert.alert("Order Created", `Order #${newOrder.data.id} created!`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not create order.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!order) return;
    Alert.alert("Payment Successful", "Your order has been paid.");

    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { orderStatus: "paid" } }),
      });

      setPaid(true);
      clearCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Checkout</Text>
        <TouchableOpacity
          onPress={handleCreateOrder}
          style={styles.checkoutButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Start Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* Shipping info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        {["name", "email", "address", "city", "postalCode", "country"].map(
          (field) => (
            <TextInput
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={shippingInfo[field as keyof ShippingInfo]}
              onChangeText={(value) =>
                handleInputChange(field as keyof ShippingInfo, value)
              }
              style={styles.input}
            />
          )
        )}
      </View>

      {/* Shipping details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping</Text>
        <Text>Standard shipping: 5–7 business days</Text>
        <Text>Free shipping for orders over $100</Text>
      </View>

      {/* Payment */}
      {!paid ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <TouchableOpacity onPress={handleApprove} style={styles.payButton}>
            <Text style={styles.payText}>Pay with PayPal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.successText}>
          Payment Successful! Thank you for your order.
        </Text>
      )}

      {/* Cart summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Cart</Text>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => it.product.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                {item.product.media?.[0] ? (
                  <Image
                    source={{ uri: item.product.media[0] }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.productTitle}>{item.product.title}</Text>
                  <Text style={styles.productPrice}>
                    ${item.product.price.toFixed(2)}
                  </Text>
                  <Text style={styles.productQty}>Qty: {item.quantity}</Text>
                </View>
              </View>
            )}
          />
        )}
        <View style={styles.subtotal}>
          <Text style={styles.subtotalText}>Subtotal</Text>
          <Text style={styles.subtotalText}>${subtotal.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: "600", fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  checkoutButton: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontWeight: "bold" },
  payButton: {
    backgroundColor: "#0070BA",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  payText: { color: "white", fontWeight: "bold" },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  image: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginRight: 10,
  },
  productTitle: { fontWeight: "600" },
  productPrice: { color: "#666" },
  productQty: { color: "#666" },
  subtotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 10,
  },
  subtotalText: { fontWeight: "600" },
  emptyText: { color: "#888" },
  successText: {
    color: "green",
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "center",
  },
});
