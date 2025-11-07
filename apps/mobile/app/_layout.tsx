// app/_layout.tsx
import { Stack } from "expo-router";
import { CartProvider } from "./context/cartProvider-mobile";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
