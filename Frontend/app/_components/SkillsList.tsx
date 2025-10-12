import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getJson } from "../utils/api";

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

interface SkillsListProps {
  category: string;
  categoryTitle: string;
}

export default function SkillsList({ category, categoryTitle }: SkillsListProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, [category]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJson(`/api/skills/category/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch skills (${response.status})`);
      }
      
      const data = await response.json();
      setSkills(data);
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading {categoryTitle} skills...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSkills}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (skills.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No {categoryTitle.toLowerCase()} skills found</Text>
        <Text style={styles.emptySubtext}>Be the first to add a skill in this category!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{categoryTitle} Skills</Text>
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
              <Text style={styles.skillCategory}>{skill.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    padding: 20,
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
  skillCategory: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
    fontWeight: "600",
  },
});
