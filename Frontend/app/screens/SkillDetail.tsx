import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getJson } from "../utils/api";

interface SkillTeacher {
  _id: string;
  name: string;
  category: string;
  description: string;
  experience: string;
  proofUrl: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SkillDetail() {
  const { skillName } = useLocalSearchParams();
  const router = useRouter();
  const [teachers, setTeachers] = useState<SkillTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skillName) {
      fetchSkillTeachers();
    }
  }, [skillName]);

  const fetchSkillTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJson(`/api/skills/teachers/${encodeURIComponent(skillName as string)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch teachers (${response.status})`);
      }
      
      const data = await response.json();
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactTeacher = (teacher: SkillTeacher) => {
    Alert.alert(
      `Contact ${teacher.userId.name}`,
      `Email: ${teacher.userId.email}`,
      [
        { text: "Cancel" },
        { 
          text: "Send Email", 
          onPress: () => {
            const emailUrl = `mailto:${teacher.userId.email}?subject=Interest in ${skillName} lessons`;
            Linking.openURL(emailUrl).catch(() => {
              Alert.alert("Error", "Could not open email client");
            });
          }
        }
      ]
    );
  };

  const handleViewProof = (proofUrl: string) => {
    Linking.openURL(proofUrl).catch(() => {
      Alert.alert("Error", "Could not open the proof link");
    });
  };

  const handleTeacherPress = (teacher: SkillTeacher) => {
    Alert.alert(
      `${teacher.userId.name} - ${skillName}`,
      `Experience: ${teacher.experience}\n\nDescription: ${teacher.description}`,
      [
        { text: "Close" },
        { text: "Contact Teacher", onPress: () => handleContactTeacher(teacher) },
        ...(teacher.proofUrl ? [{ text: "View Proof", onPress: () => handleViewProof(teacher.proofUrl) }] : [])
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading teachers for {skillName}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSkillTeachers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (teachers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No teachers found for {skillName}</Text>
          <Text style={styles.emptySubtext}>Be the first to offer this skill!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{skillName}</Text>
        <Text style={styles.countText}>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} available</Text>
        
        {teachers.map((teacher) => (
          <TouchableOpacity
            key={teacher._id}
            style={styles.teacherCard}
            onPress={() => handleTeacherPress(teacher)}
            activeOpacity={0.7}
          >
            <View style={styles.teacherHeader}>
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{teacher.userId.name}</Text>
                <Text style={styles.teacherEmail}>{teacher.userId.email}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{teacher.category}</Text>
              </View>
            </View>
            
            {teacher.description && (
              <Text style={styles.teacherDescription} numberOfLines={3}>
                {teacher.description}
              </Text>
            )}
            
            {teacher.experience && (
              <View style={styles.experienceContainer}>
                <Text style={styles.experienceLabel}>Experience:</Text>
                <Text style={styles.experienceText}>{teacher.experience}</Text>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContactTeacher(teacher)}
              >
                <Text style={styles.contactButtonText}>📧 Contact</Text>
              </TouchableOpacity>
              
              {teacher.proofUrl && (
                <TouchableOpacity 
                  style={styles.proofButton}
                  onPress={() => handleViewProof(teacher.proofUrl)}
                >
                  <Text style={styles.proofButtonText}>📎 View Proof</Text>
                </TouchableOpacity>
              )}
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
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  countText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
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
  teacherCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  teacherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 14,
    color: "#666",
  },
  categoryBadge: {
    backgroundColor: "#007AFF",
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
  teacherDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
  },
  experienceContainer: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  experienceText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  proofButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  proofButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
