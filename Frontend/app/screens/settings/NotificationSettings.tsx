import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function NotificationSettings() {
  const { theme } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [skillReq, setSkillReq] = useState(true);
  const [sessionRem, setSessionRem] = useState(true);
  const [creditUpd, setCreditUpd] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>🔔 Notification Settings</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Enable Push Notifications</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Email Notifications</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>

      <Text style={[styles.subHeader, { color: theme.muted }]}>Choose notification types:</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>New Skill Requests</Text>
        <Switch value={skillReq} onValueChange={setSkillReq} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Session Reminders</Text>
        <Switch value={sessionRem} onValueChange={setSessionRem} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Credit Updates</Text>
        <Switch value={creditUpd} onValueChange={setCreditUpd} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 20 },
  subHeader: { fontSize: 16, color: "#6b7280", marginVertical: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  label: { color: "#0f172a", fontSize: 16 },
});
