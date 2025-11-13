import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useCart } from "./context/cart-Context-mobile";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.topContainer}>
          <Text style={styles.header}>Shopping Cart ({items.length})</Text>
          <Link style={styles.closeButton} href="/">
            Close
          </Link>
        </View>
        <FlatList
          style={styles.flatlist}
          data={items}
          ItemSeparatorComponent={() => <View style={{ height: 32 }} />}
          renderItem={(items) => (
            <View style={styles.productContainer}>
              <View
                style={{
                  width: "50%",
                  height: 160,
                }}
              >
                <Image
                  source={items.item.product.media}
                  style={{
                    width: "auto",
                    height: 160,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View style={styles.productInfo}>
                <View>
                  <Text style={styles.productTitle}>
                    {items.item.product.title}
                  </Text>
                  <Text style={styles.productPrice}>
                    ${items.item.product.price}
                  </Text>
                </View>

                <View style={{ rowGap: 16 }}>
                  <View style={styles.productAmountContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        updateQty(
                          items.item.product.id,
                          items.item.quantity - 1
                        )
                      }
                      style={styles.addAndRemove}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
                      {items.item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        updateQty(
                          items.item.product.id,
                          items.item.quantity + 1
                        )
                      }
                      style={styles.addAndRemove}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(items.item.product.id)}
                    style={styles.removeButton}
                  >
                    <Text style={{ color: "#ffffff", fontWeight: 600 }}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.bottomContainer}>
          <View style={styles.subtotal}>
            <Text>Subtotal</Text>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>${subtotal}</Text>
          </View>
          <Link style={styles.closeButton} href="/checkout">
            <Text>Checkout</Text>
          </Link>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    padding: 18,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
  },
  header: {
    fontSize: 21,
    fontWeight: 600,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 21,
    backgroundColor: "#000000",
    color: "#ffffff",
    fontWeight: 600,
  },
  flatlist: {
    height: "70%",
    padding: 32,
  },
  productContainer: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  productInfo: {
    width: "50%",
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  productPrice: {
    opacity: 0.6,
  },
  productAmountContainer: {
    flexDirection: "row",
  },
  addAndRemove: {
    backgroundColor: "#BDBDBD",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  removeButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 21,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  bottomContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#BDBDBD",
    padding: 32,
    gap: 16,
  },
  subtotal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 21,
    backgroundColor: "#000000",
    color: "#ffffff",
    fontWeight: 600,
  },
});
