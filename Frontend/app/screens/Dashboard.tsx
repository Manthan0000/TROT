import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterBar from "../_components/Footerbar";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      try {
        const cached = (globalThis as any).__USER_NAME__ || (await AsyncStorage.getItem("userName"));
        if (cached) setUserName(cached);
      } catch {}
    })();
  }, []);

  const cards = [
    { title: "Creative", color: "#B2E7C9", image: "https://i.imgur.com/VuQw5lQ.png", route: "/screens/batches/creative" },
    { title: "Mentorships", color: "#FFD6A5", image: "https://i.imgur.com/4p2V0tL.png", route: "/screens/batches/mentorships" },
    { title: "Music & Dance", color: "#A7D8FF", image: "https://i.imgur.com/y9Q0w9c.png", route: "/screens/batches/music" },
    { title: "Studies", color: "#D0B3FF", image: "https://i.imgur.com/9bXv5GJ.png", route: "/screens/batches/studies" },
    { title: "Competitions", color: "#FFF59D", image: "https://i.imgur.com/3cS3Q1T.png", route: "/screens/batches/competition" },
    { title: "More", color: "#F6A5C0", image: "https://i.imgur.com/1JXz8yT.png", route: "/screens/batches/more" },
  ];

  const trendingSkills = [
    { id: 1, title: "🔥 Trending Now", skillName: "Dance", description: "Most visited skill this week!", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80&auto=format&fit=crop", category: "creative", visits: "2.5K+" },
    { id: 2, title: "⭐ Popular", skillName: "Programming", description: "Join 500+ students learning coding", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop", category: "Technical", visits: "1.8K+" },
  ];

  const handleContactUs = () => {
    Alert.alert("Contact Us", "Get in touch with our support team", [
      { text: "Cancel" },
      { text: "Email", onPress: () => Linking.openURL("mailto:jasoliya28072006@gmail.com") },
      { text: "WhatsApp", onPress: () => Linking.openURL("https://wa.me/8401487213") },
    ]);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.greet}>Hi, {userName || "User"}</Text>
        <Text style={styles.sectionTitle}>#TrotChange</Text>

        <View style={styles.grid}>
          {cards.map((c) => (
            <View key={c.title} style={[styles.card, { backgroundColor: c.color }]}> 
              <Image source={{ uri: c.image }} style={styles.cardImg} />
              <Text style={styles.cardTitle}>{c.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>🔥 Trending Skills</Text>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.sliderRow}
          >
            {trendingSkills.map((s) => (
              <View key={s.id} style={styles.slideItem}>
                <Image source={{ uri: s.image }} style={styles.slideImage} />
                <View style={styles.slideOverlay}>
                  <Text style={styles.slideBadge}>{s.title}</Text>
                  <Text style={styles.slideSkillName}>{s.skillName}</Text>
                  <Text style={styles.slideDescription}>{s.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>TROT Settings</Text>
          <View style={styles.cardsGrid}>
            <TouchableOpacity style={styles.settingsCard} onPress={handleContactUs}>
              <View style={[styles.cardBorder, { backgroundColor: "#DC2626" }]} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: "#DC2626" }]}>CONTACT US</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <FooterBar />
    </View>
  );
}

const CARD_WIDTH = width * 0.42;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F9FC" },
  scrollContainer: { paddingVertical: 24, paddingHorizontal: 16, paddingBottom: 80 },
  greet: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 24, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  card: { width: CARD_WIDTH, height: 140, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  cardImg: { width: 55, height: 55, marginBottom: 12, resizeMode: "contain" },
  cardTitle: { fontSize: 15, fontWeight: "600", textAlign: "center", color: "#333" },
  sliderContainer: { marginTop: 20, marginBottom: 20 },
  sliderTitle: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 16, textAlign: "center" },
  sliderRow: { paddingHorizontal: 16 },
  slideItem: { width: width * 0.8, height: 200, marginRight: 12, borderRadius: 20, overflow: "hidden", backgroundColor: "#e9eef5", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  slideImage: { width: "100%", height: "100%", resizeMode: "cover" },
  slideOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 16 },
  slideBadge: { fontSize: 12, fontWeight: "600", color: "#FFD700", marginBottom: 4 },
  slideSkillName: { fontSize: 22, fontWeight: "700", color: "white", marginBottom: 6 },
  slideDescription: { fontSize: 14, color: "rgba(255, 255, 255, 0.9)", lineHeight: 18, marginBottom: 8 },
  settingsSection: { marginTop: 30, paddingHorizontal: 16 },
  settingsTitle: { fontSize: 24, fontWeight: "700", color: "#222", marginBottom: 8, textAlign: "center" },
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 30 },
  settingsCard: { width: "48%", height: 120, backgroundColor: "#F8F9FA", borderRadius: 12, marginBottom: 12, marginRight: "2%", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: "hidden" },
  cardBorder: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  cardContent: { flex: 1, padding: 16, justifyContent: "space-between" },
});