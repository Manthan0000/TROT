import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getJson } from "../../utils/api";

interface Skill {
  _id: string;
  name: string;
  category: string;
  description: string;
  experience: string;
  proofUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Categories that are NOT in the main 6 cards
const MORE_CATEGORIES = [
  "Technical",
  "finance", 
  "Hardware",
  "gamming",
  "more"
];

export default function More() {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllMoreSkills();
  }, []);

  const fetchAllMoreSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch skills from all "more" categories
      const promises = MORE_CATEGORIES.map(category => 
        getJson(`/api/skills/category/${encodeURIComponent(category)}`)
      );
      
      const responses = await Promise.all(promises);
      const allSkills: Skill[] = [];
      
      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          allSkills.push(...data);
        }
      }
      
      setSkills(allSkills);
    } catch (err: any) {
      setError(err.message || "Failed to load skills");
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillPress = (skill: Skill) => {
    // Navigate to skill detail screen to show all teachers for this skill
    router.push({
      pathname: "/screens/SkillDetail",
      params: { skillName: skill.name }
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Technical": "#FF6B6B",
      "finance": "#4ECDC4", 
      "Hardware": "#45B7D1",
      "gamming": "#96CEB4",
      "more": "#FFEAA7"
    };
    return colors[category] || "#DDA0DD";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading more skills...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAllMoreSkills}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (skills.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No additional skills found</Text>
          <Text style={styles.emptySubtext}>Be the first to add skills in these categories!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>More Skills</Text>
        <Text style={styles.countText}>{skills.length} skill{skills.length !== 1 ? 's' : ''} found</Text>
        
        {skills.map((skill) => (
          <TouchableOpacity
            key={skill._id}
            style={styles.skillCard}
            onPress={() => handleSkillPress(skill)}
            activeOpacity={0.7}
          >
            <View style={styles.skillHeader}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(skill.category) }]}>
                <Text style={styles.categoryText}>{skill.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F7F9FC" 
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 80,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    padding: 20,
    paddingTop: 80,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  back: { 
    fontSize: 16, 
    color: "#007AFF", 
    fontWeight: "600" 
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  countText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  skillCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});
