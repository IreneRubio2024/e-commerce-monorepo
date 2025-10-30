import { Image } from "expo-image";
import { Platform, ScrollView, StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { View, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { logo, filterBar, profile, cart, search, placeholder } from "@/assets/images";
import { useState } from "react";
import { FlatList } from "react-native";

export default function HomeScreen() {

  const [categories, setCategories] = useState<string[]>(["New", "Shirts", "Polo Shirts", "Shorts", "Best Selling", "T-Shirts", "Jeans", "Sneakers", "Bags"])

 const data = Array.from({ length: 10 })

  return (
    <SafeAreaProvider>
      <SafeAreaView>

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

      <View style={styles.headerBox}>
      <Text style={styles.headerText}>Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={search} style={styles.searchIcon}/>
        <TextInput style={styles.searchInput} placeholder="search" />
      </View>

      <Text style={styles.filter}>{'Filters >'}</Text>

      <ScrollView horizontal style={styles.categoryScroll}>
        <View style={styles.categoryScrollBox}>
        {categories.map((cat, i)=> (<View style={styles.categoryBox} key={i}><Text>{cat}</Text></View>))}
        </View>
      </ScrollView>

      <FlatList
      data={data}
      numColumns={2} 
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ index }) => (
        <View style={styles.productCard}>
          <Image source={placeholder} style={{ width: "auto", height: 200 }} />
          <Text style={{fontSize: 16, opacity: 66}}>Type</Text>
          <View style={styles.productTitleandPrice}>
            <Text style={{fontSize: 18}}>Title</Text>
            <Text style={{fontSize: 18}}>{'$ 100'}</Text>
          </View>
        </View>
      )}
      columnWrapperStyle={{justifyContent: "space-between", alignItems: "flex-start"}} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 270, paddingHorizontal: 18 }} 
    />

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

left: {
  flex: 1,
},

center: {
  flex: 1,
  alignItems: 'center',
},

right: {
  flex: 1,
  flexDirection: "row",
  justifyContent: 'flex-end',
  gap: 6,
},

headerBox:{
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 63
},

headerText:{
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: 1.1
},
searchContainer:{
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 15,
  marginHorizontal: 18,
  padding: 12,
  width: "auto",
  backgroundColor: "#D9D9D9"
},
searchIcon:{
  width: 11,
  height: 11
},
searchInput:{
  flexDirection: "row",
  width: '80%',
  textAlign: "right",
  fontSize: 16,
},
filter:{
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: 1.1,
  marginTop: 20,
  marginLeft: 18
},
categoryScroll:{
display: "flex",
marginTop: 11,
marginLeft: 18,
marginBottom: 11,
height: 50,
minHeight: 50
},
categoryScrollBox:{
  flexDirection: "row",
  width: 561,
  height: 50,
  flexWrap: "wrap",
  columnGap: 14,
  rowGap: 2
  
},
categoryBox:{
  justifyContent: "center",
  alignItems: "center",
  width: 101,
  height: 24,
  borderWidth: 1,
  borderColor: "#5E5E5E",
  textAlign: "center",
  color: "#5E5E5E",
},
productScroll:{
  marginLeft: 18,
  alignItems: "flex-start"
},
productCard:{
  width: '48%',
  height: 243,
  rowGap: 5,
  marginBottom: 21
},
productTitleandPrice:{
  flexDirection: "row",
  justifyContent: "space-between"
}

});
