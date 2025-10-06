import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../_components/Header";
import FooterBar from "../_components/Footerbar";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");

  // ✅ Fetch user name from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const cached =
          (globalThis as any).__USER_NAME__ ||
          (await AsyncStorage.getItem("userName"));
        if (cached) setUserName(cached);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // ✅ Updated routes (exactly matching App.tsx names)
  const cards = [
  {
    title: "Creative",
    color: "#B2E7C9",
    image: require("../../assets/images/creative.png"),
    route: "screens/batches/creative",
  },
  {
    title: "Mentorships",
    color: "#FFD6A5",
    image: require("../../assets/images/mentorships.png"),
    route: "screens/batches/mentorships",
  },
  {
    title: "Music & Dance",
    color: "#A7D8FF",
    image: require("../../assets/images/music.png"),
    route: "screens/batches/music",
  },
  {
    title: "Studies (Primary & Secondary)",
    color: "#D0B3FF",
    image: require("../../assets/images/studies.png"),
    route: "screens/batches/studies",
  },
  {
    title: "Competitions",
    color: "#FFF59D",
    image: require("../../assets/images/competition.png"),
    route: "screens/batches/competition",
  },
  {
    title: "More",
    color: "#F6A5C0",
    image: require("../../assets/images/more.png"),
    route: "screens/batches/more",
  },
];

  // ✅ Slider images (remote URIs)
  const sliderImages = [
    // knowledge transfer heads
    {
      uri:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
    },
    // global community avatars
    {
      uri:
        "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80&auto=format&fit=crop",
    },
    // team planning/brainstorm
    {
      uri:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80&auto=format&fit=crop",
    },
    // dancer motion art
    {
      uri:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80&auto=format&fit=crop",
    },
  ];

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header userName={userName} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>#TrotChange</Text>

          <View style={styles.grid}>
            {cards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </View>

          {/* Slider below cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.sliderRow}
          >
            {sliderImages.map((img, idx) => (
              <View key={idx} style={styles.slideItem}>
                <Image source={img} style={styles.slideImage} />
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <FooterBar />
      </View>
    </SafeAreaView>
  );
}

function Card({ title, color, image, route }: any) {
  const router = useRouter();

  const handlePress = () => {
    try {
      router.push(`/${route}`);
    } catch (err) {
      console.warn(`⚠️ Failed to navigate to route: ${route}`, err);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: color }]}
      onPress={handlePress}
    >
      {image && <Image source={image} style={styles.cardImage} />}
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
}


const CARD_WIDTH = width * 0.42;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F9FC" },
  container: { flex: 1, backgroundColor: "#F7F9FC" },
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  sliderRow: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  slideItem: {
    width: width * 0.8,
    height: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#e9eef5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    width: CARD_WIDTH,
    height: 140,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: 55,
    height: 55,
    marginBottom: 12,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
