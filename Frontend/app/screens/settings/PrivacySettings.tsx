import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function PrivacySettings() {
  const { theme } = useTheme();
  const [showSkills, setShowSkills] = useState(true);
  const [allowRequests, setAllowRequests] = useState("Anyone");

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>🔒 Privacy Settings</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Show my skills publicly</Text>
        <Switch value={showSkills} onValueChange={setShowSkills} />
      </View>

      <Text style={[styles.subHeader, { color: theme.muted }]}>Who can send you requests?</Text>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.surface }, allowRequests === "Anyone" && styles.activeOption]} onPress={() => setAllowRequests("Anyone")}>
        <Text style={[styles.optionText, { color: theme.text }]}>Anyone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.surface }, allowRequests === "Mutual" && styles.activeOption]} onPress={() => setAllowRequests("Mutual")}>
        <Text style={[styles.optionText, { color: theme.text }]}>Mutual matches only</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4d4d" }]}>
        <Text style={styles.buttonText}>Block / Report User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 20 },
  subHeader: { fontSize: 16, color: "#6b7280", marginTop: 20, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  label: { color: "#0f172a", fontSize: 16 },
  option: { padding: 12, backgroundColor: "#ffffff", borderRadius: 8, marginVertical: 5 },
  activeOption: { backgroundColor: "#00e0ff55" },
  optionText: { color: "#0f172a" },
  button: { marginTop: 20, padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
