import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";


import { fetchProduct, type Product } from "@repo/shared/products";
import { useCart } from "../context/cart-Context-mobile"; 

import { logo, filterBar, profile, cart } from "@/assets/images";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        const data = await fetchProduct(slug);
        setProduct(data);
        setSelectedImage(data?.detailMedia?.[0] || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
    setAdded(true);
    Alert.alert("Added to cart!", `${product.title} has been added.`);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#555" />
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
    
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={filterBar} style={{ width: 26, height: 16 }} />
        </TouchableOpacity>

        <Image source={logo} style={{ width: 29, height: 29 }} />

        <View style={styles.right}>
          <TouchableOpacity onPress={() => router.push("./cart")}>
            <Image source={cart} style={{ width: 41, height: 41 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => router.push("./profile")}
          >
            <Image source={profile} style={{ width: 41, height: 41 }} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView contentContainerStyle={styles.container}>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.mainImage}
            contentFit="cover"
          />
        )}

 
        <ScrollView horizontal style={styles.thumbnailScroll}>
          {product.detailMedia?.map((img, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedImage(img)}>
              <Image
                source={{ uri: img }}
                style={[
                  styles.thumbnail,
                  selectedImage === img && styles.selectedThumbnail,
                ]}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

   
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{`$ ${product.price}`}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text
          style={[
            styles.stock,
            product.inStock ? styles.inStock : styles.outOfStock,
          ]}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </Text>

      
        <TouchableOpacity
          style={[styles.addButton, added && styles.addedButton]}
          onPress={handleAddToCart}
          disabled={added}
        >
          <Text style={styles.addButtonText}>
            {added ? "ADDED ✓" : "ADD TO CART"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  thumbnailScroll: {
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedThumbnail: {
    borderColor: "#000",
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    marginBottom: 12,
  },
  inStock: {
    color: "green",
  },
  outOfStock: {
    color: "red",
  },
  addButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  addedButton: {
    backgroundColor: "green",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
