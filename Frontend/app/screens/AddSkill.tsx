import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJson } from "../../lib/api";
import { useRouter } from "expo-router";

const CATEGORY_OPTIONS = [
  "Technical",
  "creative",
  "mentorship",
  "Music and Dance",
  "Primary and Secondary",
  "Competition",
  "more",
  "finance",
  "Hardware",
  "gamming",
];

export default function AddSkill() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => name.trim().length > 0 && category, [name, category]);

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const resp = await postJson(
        "/api/skills",
        { name, category, description, experience, proofUrl },
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.message || `Failed to add skill (${resp.status})`);
        return;
      }
      alert("Skill added successfully");
      router.back();
    } catch (e: any) {
      alert(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add Skill</Text>

      <Text style={styles.label}>Skill</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., React Native"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pillRow}>
        {CATEGORY_OPTIONS.map((opt) => {
          const active = category === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => setCategory(opt)}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Brief description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={styles.input}
        placeholder="Years or short summary"
        value={experience}
        onChangeText={setExperience}
      />

      <Text style={styles.label}>Any proof (URL)</Text>
      <TextInput
        style={styles.input}
        placeholder="Link to portfolio, certificate, etc."
        value={proofUrl}
        onChangeText={setProofUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.primaryBtn, (!canSubmit || submitting) && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit || submitting}
      >
        <Text style={styles.primaryBtnText}>{submitting ? "Saving..." : "Save Skill"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#999",
  },
  pillActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  pillText: {
    color: "#222",
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});


