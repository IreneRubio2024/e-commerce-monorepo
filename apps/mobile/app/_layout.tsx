import { Stack } from "expo-router";
import CartProvider from "./context/cart-Context-mobile"; // adjust path

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
