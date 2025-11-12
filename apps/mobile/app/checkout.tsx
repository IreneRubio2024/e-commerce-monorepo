import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useCart } from "./context/cart-Context-mobile";
import { createOrder, OrderItem } from "@repo/shared/orders";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import PayPalButton from "./PayPalButton";
interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function Checkout({ route }: any) {
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
  const [order, setOrder] = useState<{ id: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
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
    if (!items.length) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }
    // Validera att alla fält är ifyllda
    const requiredFields: (keyof ShippingInfo)[] = [
      "name",
      "email",
      "address",
      "city",
      "postalCode",
      "country",
    ];
    const emptyFields = requiredFields.filter((field) => !shippingInfo[field]);
    if (emptyFields.length > 0) {
      Alert.alert("Error", "Please fill in all shipping information");
      return;
    }
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
      setShowPayPal(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not create order.");
    } finally {
      setLoading(false);
    }
  };
  const handlePayPalSuccess = async (details: any) => {
    if (!order) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            orderStatus: "paid",
            paypalOrderId: details.orderID,
            paypalPayerId: details.payerID,
          }
        }),
      });
      setPaid(true);
      Alert.alert(
        "Payment Successful",
        `Thank you! Your order #${order.id} has been paid.`
      );
      clearCart();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Payment succeeded but order update failed");
    }
  };
  const handlePayPalError = (error: any) => {
    console.error("PayPal error:", error);
    Alert.alert("Payment Error", "Something went wrong with PayPal. Please try again.");
  };
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            keyExtractor={(it) => it.product.id.toString()}
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 60,
            }}
            ListHeaderComponent={
              <>
                {/* Header row */}
                <View style={styles.headerRow}>
                  <Text style={styles.title}>Checkout</Text>
                  <Link href="/" style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Link>
                </View>
                {/* Information section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Information</Text>
                  {[
                    "name",
                    "email",
                    "address",
                    "city",
                    "postalCode",
                    "country",
                  ].map((field) => (
                    <TextInput
                      key={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={shippingInfo[field as keyof ShippingInfo]}
                      onChangeText={(value) =>
                        handleInputChange(field as keyof ShippingInfo, value)
                      }
                      style={styles.input}
                      editable={!paid}
                    />
                  ))}
                </View>
                {/* Shipping details */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Shipping</Text>
                  <Text>Standard shipping: 5–7 business days</Text>
                </View>
                {/* Payment */}
                {!paid ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    {!order && !showPayPal && (
                      <TouchableOpacity
                        onPress={handleCreateOrder}
                        style={styles.checkoutButton}
                        disabled={loading}
                      >
                        <Text style={styles.checkoutText}>
                          {loading ? "Creating Order..." : "Continue to Payment"}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {order && showPayPal && (
                      <>
                        <Text style={styles.orderIdText}>
                          Order #{order.id} - ${order.total.toFixed(2)}
                        </Text>
                        <PayPalButton
                          amount={order.total.toFixed(2)}
                          orderId={order.id}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                        />
                      </>
                    )}
                  </View>
                ) : (
                  <View style={styles.successContainer}>
                    <Text style={styles.successText}>
                      ✓ Payment Successful!
                    </Text>
                    <Text style={styles.successSubtext}>
                      Thank you for your order #{order?.id}
                    </Text>
                  </View>
                )}
                {/* Cart summary header */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Your Cart</Text>
                </View>
              </>
            }
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
            ListFooterComponent={
              <View style={styles.subtotal}>
                <Text style={styles.subtotalText}>Subtotal</Text>
                <Text style={styles.subtotalText}>${subtotal.toFixed(2)}</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  // ... behåll alla dina befintliga styles ...
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, marginTop: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: "600", fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 21,
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontWeight: "600" as any,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontWeight: "bold" },
  orderIdText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
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
  successContainer: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  successText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  successSubtext: {
    color: "#2E7D32",
    fontSize: 14,
  },
});

