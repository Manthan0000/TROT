import React, { useEffect, useState, useRef } from "react";
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
  Alert,
  Linking,
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rating, setRating] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // ✅ Trending Skills Slider Data
  const trendingSkills = [
    {
      id: 1,
      title: "🔥 Trending Now",
      skillName: "Dance",
      description: "Most visited skill this week! Learn from professional dancers.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80&auto=format&fit=crop",
      category: "creative",
      visits: "2.5K+ visits"
    },
    {
      id: 2,
      title: "⭐ Popular Choice",
      skillName: "Programming",
      description: "Join 500+ students learning coding skills from experts.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
      category: "Technical",
      visits: "1.8K+ visits"
    },
    {
      id: 3,
      title: "🎯 Hot Skill",
      skillName: "Music Production",
      description: "Create amazing music with guidance from industry professionals.",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80&auto=format&fit=crop",
      category: "Music and Dance",
      visits: "1.2K+ visits"
    },
    {
      id: 4,
      title: "🚀 Rising Fast",
      skillName: "Digital Marketing",
      description: "Master online marketing strategies with real-world projects.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80&auto=format&fit=crop",
      category: "finance",
      visits: "950+ visits"
    },
  ];

  // Handle slide change
  const handleSlideChange = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.8 + 12));
    setCurrentSlide(slideIndex);
  };

  // Handle skill slide press
  const handleSkillSlidePress = (skill: any) => {
    router.push({
      pathname: "/screens/SkillDetail",
      params: { skillName: skill.skillName }
    });
  };

  // Footer section handlers
  const handleContactUs = () => {
    Alert.alert(
      "Contact Us",
      "Get in touch with our support team",
      [
        { text: "Cancel" },
        { text: "Email", onPress: () => Linking.openURL("mailto:jasoliya28072006@gmail.com") },
        { text: "WhatsApp", onPress: () => Linking.openURL("https://wa.me/8401487213") }
      ]
    );
  };

  const handleMyProfile = () => {
    router.push("/screens/Profile");
  };

  const handleSuggestion = () => {
    Alert.alert(
      "Give Suggestion",
      "We'd love to hear your feedback!",
      [
        { text: "Cancel" },
        { text: "Email Feedback", onPress: () => Linking.openURL("mailto:jasoliya28072006@gmail.com") },
        { text: "WhatsApp", onPress: () => Linking.openURL("https://wa.me/8401487213") }
      ]
    );
  };

  const handleTermsConditions = () => {
    Alert.alert(
      "Terms & Conditions",
      "View our terms and conditions",
      [
        { text: "Cancel" },
        { text: "View Details", onPress: () => console.log("Open Terms & Conditions") }
      ]
    );
  };

  const handleRateNow = () => {
    Alert.alert(
      "Rate TROT",
      "Thank you for using TROT! Please rate your experience.",
      [
        { text: "Cancel" },
        { text: "Rate on App Store", onPress: () => console.log("Open App Store") },
        { text: "Rate on Play Store", onPress: () => console.log("Open Play Store") }
      ]
    );
  };

  const handleWhatsAppHelp = () => {
    Linking.openURL("https://wa.me/8401487213?text=Hi, I need help with TROT app");
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header userName={userName} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>#TrotChange</Text>

          <View style={styles.grid}>
            {cards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </View>

          {/* Trending Skills Slider */}
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderTitle, { color: theme.text }]}>🔥 Trending Skills</Text>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={styles.sliderRow}
              onMomentumScrollEnd={handleSlideChange}
            >
              {trendingSkills.map((skill, idx) => (
                <TouchableOpacity
                  key={skill.id}
                  style={styles.slideItem}
                  onPress={() => handleSkillSlidePress(skill)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: skill.image }} style={styles.slideImage} />
                  <View style={styles.slideOverlay}>
                    <View style={styles.slideContent}>
                      <Text style={styles.slideBadge}>{skill.title}</Text>
                      <Text style={styles.slideSkillName}>{skill.skillName}</Text>
                      <Text style={styles.slideDescription}>{skill.description}</Text>
                      <View style={styles.slideFooter}>
                        <Text style={styles.slideCategory}>{skill.category}</Text>
                        <Text style={styles.slideVisits}>{skill.visits}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Dots Indicator */}
            <View style={styles.dotsBar}>
              <View style={styles.dotsContainer}>
                {trendingSkills.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      currentSlide === idx && styles.activeDot
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>TROT Settings</Text>
            <Text style={[styles.settingsSubtitle, { color: theme.muted }]}>Manage your experience</Text>

            {/* Interactive Cards Grid */}
            <View style={styles.cardsGrid}>
              <TouchableOpacity style={styles.settingsCard} onPress={handleContactUs}>
                <View style={[styles.cardBorder, { backgroundColor: "#DC2626" }]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: "#DC2626" }]}>CONTACT US</Text>
                  <View style={styles.cardIcon}>
                    <Text style={styles.iconText}>📞</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsCard} onPress={handleMyProfile}>
                <View style={[styles.cardBorder, { backgroundColor: "#EA580C" }]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: "#EA580C" }]}>MY PROFILE</Text>
                  <View style={styles.cardIcon}>
                    <Text style={styles.iconText}>👤</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsCard} onPress={handleSuggestion}>
                <View style={[styles.cardBorder, { backgroundColor: "#A16207" }]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: "#A16207" }]}>SUGGESTION</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.muted }]}>Give suggestion ></Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsCard} onPress={handleTermsConditions}>
                <View style={[styles.cardBorder, { backgroundColor: "#2563EB" }]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: "#2563EB" }]}>TERMS & CONDITIONS</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.muted }]}>View Details ></Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Rate Your Experience Section */}
            <View style={[styles.ratingSection, { backgroundColor: theme.surface }]}>
              <Text style={[styles.ratingTitle, { color: theme.text }]}>Rate Your Experience !!</Text>
              <View style={styles.ratingContainer}>
                <TouchableOpacity style={styles.rateButton} onPress={handleRateNow}>
                  <Text style={styles.rateButtonText}>Rate Now</Text>
                </TouchableOpacity>
                <View style={styles.starsDisplay}>
                  {renderStars()}
                </View>
              </View>
            </View>

            {/* Help/Support Section */}
            <View style={[styles.helpSection, { backgroundColor: theme.surface }]}>
              <Text style={[styles.helpTitle, { color: theme.text }]}>Do you need our help?</Text>
              <Text style={[styles.helpDescription, { color: theme.muted }]}>
                TROT is available to help you. Please contact us on WhatsApp for queries.
              </Text>
              <View style={styles.helpContainer}>
                <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppHelp}>
                  <Text style={styles.whatsappIcon}>💬</Text>
                  <Text style={styles.whatsappText}>Get the help →</Text>
                </TouchableOpacity>
                <View style={styles.supportIcon}>
                  <Text style={styles.supportEmoji}>🎧</Text>
                </View>
              </View>
            </View>
          </View>
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
      style={[styles.categoryCard, { backgroundColor: color }]}
      onPress={handlePress}
    >
      {image && <Image source={image} style={styles.categoryCardImage} />}
      <Text style={styles.categoryCardTitle}>{title}</Text>
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
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  sliderContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sliderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  sliderRow: {
    paddingHorizontal: 16,
  },
  slideItem: {
    width: width * 0.8,
    height: 200,
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#e9eef5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  slideOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  slideContent: {
    flex: 1,
  },
  slideBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 4,
  },
  slideSkillName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
  },
  slideDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
    marginBottom: 8,
  },
  slideFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slideCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slideVisits: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34C759",
  },
  dotsBar: {
    backgroundColor: "#FF6B9D",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "white",
    width: 16,
    height: 10,
    borderRadius: 5,
  },
  settingsSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  settingsSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  settingsCard: {
    width: "48%",
    height: 120,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
    marginRight: "2%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  cardIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    opacity: 0.3,
  },
  iconText: {
    fontSize: 24,
  },
  ratingSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rateButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  starsDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 24,
    color: "#D1D5DB",
  },
  starFilled: {
    color: "#FCD34D",
  },
  helpSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
  helpDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 16,
  },
  whatsappIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  whatsappText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  supportIcon: {
    alignItems: "center",
  },
  supportEmoji: {
    fontSize: 40,
  },
  categoryCard: {
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
  categoryCardImage: {
    width: 55,
    height: 55,
    marginBottom: 12,
    resizeMode: "contain",
  },
  categoryCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
