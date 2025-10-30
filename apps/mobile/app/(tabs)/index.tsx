import { Image } from "expo-image";
import {
  Animated,
  Easing,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import {
  logo,
  filterBar,
  profile,
  cart,
  search,
  placeholder,
} from "@/assets/images";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const [openFilter, setOpenFilter] = useState(false);
  const [categories] = useState([
    "New",
    "Shirts",
    "Polo Shirts",
    "Shorts",
    "Best Selling",
    "T-Shirts",
    "Jeans",
    "Sneakers",
    "Bags",
  ]);
  const data = Array.from({ length: 10 });

  const numColumns = 2;

  // --- Animation setup ---
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: openFilter ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [openFilter]);

  const filterAnimatedStyle = {
    left: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-screenWidth * 0.5, 0], // hidden → visible
    }),
  };

  const contentAnimatedStyle = {
    marginLeft: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screenWidth * 0.5], // moves to middle
    }),
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={styles.left}>
            <Image source={filterBar} style={{ width: 26, height: 16 }} />
          </View>
          <View style={styles.center}>
            <Image source={logo} style={{ width: 29, height: 29 }} />
          </View>
          <View style={styles.right}>
            <Image source={cart} style={{ width: 41, height: 41 }} />
            <Image source={profile} style={{ width: 41, height: 41 }} />
          </View>
        </View>

        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Products</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Image source={search} style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="search" />
        </View>
        <Pressable onPress={() => setOpenFilter(!openFilter)}>
          <Text style={styles.filterToggle}>
            Filter {openFilter ? "<" : ">"}
          </Text>
        </Pressable>
        {/* Main wrapper */}
        <View style={styles.mainWrapper}>
          {/* --- Filter Panel (absolute + animated) --- */}
          <Animated.View style={[styles.filterSection, filterAnimatedStyle]}>
            <Text style={styles.filterTitle}>Size</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.categoryBox}>
                <Text>S</Text>
              </View>
              <View style={styles.categoryBox}>
                <Text>M</Text>
              </View>
              <View style={styles.categoryBox}>
                <Text>L</Text>
              </View>
              <View style={styles.categoryBox}>
                <Text>XL</Text>
              </View>
            </View>

            <Pressable onPress={() => setOpenFilter(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </Animated.View>

          {/* --- Products Section (shifts to center) --- */}
          <Animated.View style={[styles.mainContainer, contentAnimatedStyle]}>
            {/* Category Scroll */}
            <ScrollView horizontal style={styles.categoryScroll}>
              <View style={styles.categoryScrollBox}>
                {categories.map((cat, i) => (
                  <View style={styles.categoryBox} key={i}>
                    <Text>{cat}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <FlatList
              data={data}
              numColumns={2} // fixed
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ index }) => (
                <View
                  style={[
                    styles.productCard,
                    {
                      width: openFilter ? "100%" : "48%", // 1 col = 100%, 2 col = 48%
                    },
                  ]}
                >
                  <View style={{ width: "100%", aspectRatio: 3 / 4 }}>
                    <Image
                      source={placeholder}
                      style={{ width: "100%", height: "100%", borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>

                  <Text style={{ fontSize: 16, opacity: 0.66 }}>Type</Text>
                  <View style={styles.productTitleandPrice}>
                    <Text style={{ fontSize: 18 }}>Title</Text>
                    <Text style={{ fontSize: 18 }}>{"$ 100"}</Text>
                  </View>
                </View>
              )}
              columnWrapperStyle={
                openFilter
                  ? { flexDirection: "column" } // single column layout
                  : {
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    } // 2 col
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 270,
                paddingHorizontal: 18,
              }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
  headerBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginHorizontal: 18,
    padding: 12,
    backgroundColor: "#D9D9D9",
  },
  searchIcon: { width: 11, height: 11 },
  searchInput: {
    flexDirection: "row",
    width: "80%",
    textAlign: "right",
    fontSize: 16,
  },
  mainWrapper: {
    flex: 1,
  },
  filterSection: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%", // 50% of the screen

    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#CCC",
    zIndex: 10,
  },
  filterTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  close: {
    marginTop: 20,
    color: "#007AFF",
    fontWeight: "600",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterToggle: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.1,
    marginTop: 20,
    paddingLeft: 18,
  },
  categoryScroll: {
    marginTop: 11,
    marginLeft: 18,
    marginBottom: 11,
    height: 50,
  },
  categoryScrollBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
  },
  categoryBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 24,
    borderWidth: 1,
    borderColor: "#5E5E5E",
  },
  productCard: {
    width: "48%",
    height: "auto",
    rowGap: 5,
    marginBottom: 21,
  },
  productTitleandPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
