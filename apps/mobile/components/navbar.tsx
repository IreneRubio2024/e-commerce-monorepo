import { cart, filterBar, logo, profile } from "@/assets/images";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Link } from "expo-router";

export function Navbar() {
  return (
    <View style={styles.navbar}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={filterBar} style={{ width: 26, height: 16 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <Image source={logo} style={{ width: 29, height: 29 }} />
      </View>
      <View style={styles.right}>
        <Link href="/cart">
          <Image source={cart} style={{ width: 41, height: 41 }} />
        </Link>
        <Image source={profile} style={{ width: 41, height: 41 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 18,
  },
  left: { flex: 1 },
  center: { flex: 1, alignItems: "center" },
  right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
});
