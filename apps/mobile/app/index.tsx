import { useEffect, useRef, useState } from "react";
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
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  logo,
  filterBar,
  profile,
  cart,
  search,
  placeholder,
} from "@/assets/images";
import { useRouter } from "expo-router";

import { fetchProducts, type Product } from "@repo/shared/products";
import { Navbar } from "@/components/navbar";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const [openFilter, setOpenFilter] = useState(false);
  const [categories, setCategory] = useState<string[]>([]);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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
      outputRange: [-screenWidth * 0.5, 0],
    }),
  };

  const contentAnimatedStyle = {
    marginLeft: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screenWidth * 0.5],
    }),
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetched = await fetchProducts();
        setProducts(fetched);
        setFilteredProducts(fetched);
        setCategory(fetched.map((item) => item.category));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  function applyCategory(category: string) {
    if (category == "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((item) => item.category == category);
      setFilteredProducts(filtered);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Products</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Image source={search} style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="search" />
        </View>

        {/* <Pressable onPress={() => setOpenFilter(!openFilter)}>
          <Text style={styles.filterToggle}>
            Filter {openFilter ? "<" : ">"}
          </Text>
        </Pressable> */}

        {/* Main wrapper */}
        <View style={styles.mainWrapper}>
          {/* --- Filter Panel (absolute + animated) --- */}
          <Animated.View style={[styles.filterSection, filterAnimatedStyle]}>
            <Text style={styles.filterTitle}>Size</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            ></View>

            <Pressable onPress={() => setOpenFilter(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </Animated.View>

          {/* --- Products Section (shifts to center) --- */}
          <Animated.View style={[styles.mainContainer, contentAnimatedStyle]}>
            {/* Category Scroll */}
            <ScrollView horizontal style={styles.categoryScroll}>
              <View style={styles.categoryScrollBox}>
                <TouchableOpacity
                  onPress={() => applyCategory("All")}
                  style={styles.categoryBox}
                >
                  <Text>All</Text>
                </TouchableOpacity>
                {categories.map((cat, i) => (
                  <TouchableOpacity
                    onPress={() => applyCategory(cat)}
                    style={styles.categoryBox}
                    key={i}
                  >
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* --- Product List --- */}
            {loading ? (
              <Text style={{ textAlign: "center", marginTop: 50 }}>
                Loading products...
              </Text>
            ) : products.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 50 }}>
                No products found
              </Text>
            ) : (
              <FlatList
                data={filteredProducts}
                numColumns={openFilter ? 1 : 2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.productCard,
                      { width: openFilter ? "100%" : "48%" },
                    ]}
                    onPress={() => router.push(`./products/${item.slug}`)}
                  >
                    <View style={{ width: "100%", aspectRatio: 3 / 4 }}>
                      <Image
                        source={{
                          uri:
                            item.media?.[0] ||
                            "https://via.placeholder.com/300",
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={{ fontSize: 16, opacity: 0.66 }}>
                      {item.category}
                    </Text>
                    <View style={styles.productTitleandPrice}>
                      <Text style={{ fontSize: 18 }}>{item.title}</Text>
                      <Text style={{ fontSize: 18 }}>{`$ ${item.price}`}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                columnWrapperStyle={
                  openFilter
                    ? { flexDirection: "column" }
                    : {
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 270,
                  paddingHorizontal: 18,
                }}
              />
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
    width: "50%",
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
    marginTop: 12,
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
