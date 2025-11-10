import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Cart() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text>Cart page</Text>
          <Link href="/checkout">Checkout</Link>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
