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
import { useTheme } from "../theme/ThemeContext";
import { skillCategories, type SkillCategory } from "../data/skillCategories";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const { theme } = useTheme();
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

  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = React.useRef<ScrollView>(null);

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (sliderRef.current) {
        const nextSlide = (activeSlide + 1) % sliderImages.length;
        sliderRef.current.scrollTo({
          x: nextSlide * width * 0.8,
          animated: true,
        });
        setActiveSlide(nextSlide);
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [activeSlide, sliderImages.length]);

  const handleScroll = (event: any) => {
    const slideSize = width * 0.8;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setActiveSlide(index);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header userName={userName} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* <Text style={[styles.sectionTitle, { color: theme.text }]}>#TrotChange</Text> */}

          <View style={styles.grid}>
            {skillCategories.map((category, index) => (
              <Card key={index} {...category} />
            ))}
          </View>

          {/* Slider below cards */}
          <View>
            <ScrollView
              ref={sliderRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.sliderRow}
            >
              {sliderImages.map((img, idx) => (
                <View key={idx} style={styles.slideItem}>
                  <Image source={img} style={styles.slideImage} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {sliderImages.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor: idx === activeSlide ? theme.text : theme.muted,
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <FooterBar />
      </View>
    </SafeAreaView>
  );
}

function Card(props: SkillCategory) {
  const router = useRouter();
  const { title, color, image, route, id } = props;

  const handlePress = () => {
    try {
      router.push({
        pathname: `/${route}`,
        params: { categoryId: id }
      });
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
    color: "#1a202c",
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
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
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
    borderRadius:16
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
    width:55,
    height: 55,
    marginBottom: 12,
    resizeMode: "contain",
    borderRadius: 5,
    
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#4a5568",
  },
});
