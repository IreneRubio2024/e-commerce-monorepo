import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text>Checkout page</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
