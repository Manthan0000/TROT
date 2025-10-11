import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Settings() {
  const router = useRouter();

  const sections = [
    { title: "Account Settings", route: "./settings/AccountSettings" },
    { title: "Privacy Settings", route: "./settings/PrivacySettings" },
    { title: "Notification Settings", route: "./settings/NotificationSettings" },
    { title: "Help & Support", route: "./settings/HelpSupport" },
    { title: "Logout", route: "./settings/Logout" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Settings</Text>
      {sections.map((sec) => (
        <TouchableOpacity
          key={sec.title}
          style={styles.item}
          onPress={() => router.push(sec.route)}
        >
          <Text style={styles.itemText}>{sec.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", color: "#00e0ff", marginBottom: 20 },
  item: {
    padding: 15,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginVertical: 8,
  },
  itemText: { color: "#fff", fontSize: 16 },
});