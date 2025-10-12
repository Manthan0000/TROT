import React, { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";

const SUPPORT_EMAIL = "neevm789@gmail.com";

// helper mail component removed (not used) -- using inline mailto calls below

export default function HelpSupport() {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqVisible, setFaqVisible] = useState(true);
  const [allOpen, setAllOpen] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userEmail");
        if (saved) setUserEmail(saved);
      } catch {}
    })();
  }, []);

  const FAQ = [
    { q: "How do I reset my password?", a: "Go to Settings → Account → Reset Password and follow the instructions. Check your email for a reset link." },
    { q: "How do I change my avatar?", a: "Open Profile → Create Avatar, pick a photo and Save. The app will upload it to your profile." },
    { q: "What is Skill Exchange?", a: "Skill Exchange lets you list a skill you'd like to teach and request skills to learn from others. You can connect, schedule sessions, and exchange feedback." },
    { q: "How does billing/credits work?", a: "Credits are purchased from the Buy Credits screen. They are consumed when you enroll in paid sessions or buy premium features." },
    // Skill Exchange specific questions
    { q: "How do I list a skill to teach?", a: "Go to the Skill Exchange section, tap 'Offer a Skill', provide a title, description, hourly rate (in credits), and availability." },
    { q: "How do I request to learn a skill?", a: "Search Skill Exchange, find a teacher, and request a session. After the teacher accepts, schedule a time and pay with credits." },
    { q: "How is safety handled in Skill Exchange?", a: "We recommend exchanging public contact info only after both parties agree. Use in-app messaging for initial conversations and report suspicious behavior to support." },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={[styles.header, { color: theme.text }]}>❓ Help & Support</Text>

      <TouchableOpacity style={[styles.item, { backgroundColor: theme.surface, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]} onPress={() => setFaqVisible(!faqVisible)}>
        <Text style={[styles.itemText, { color: theme.text }]}>📘 FAQ (How-to Guides)</Text>
        <Text style={[styles.itemText, { color: theme.text, opacity: 0.8 }]}>{faqVisible ? "Hide" : "Show"}</Text>
      </TouchableOpacity>

      {faqVisible && (
        <>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setAllOpen(!allOpen)}>
              <Text style={{ color: theme.muted }}>{allOpen ? "Collapse all" : "Expand all"}</Text>
            </TouchableOpacity>
          </View>

          {FAQ.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.item, { backgroundColor: theme.surface }, (openIndex === idx || allOpen) && styles.itemOpen]}
              onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <Text style={[styles.itemText, { color: theme.text }]}>{(openIndex === idx || allOpen) ? "▾ " : "▸ "}{item.q}</Text>
              {(openIndex === idx || allOpen) && <Text style={[styles.answerText, { color: theme.muted }]}>{item.a}</Text>}
            </TouchableOpacity>
          ))}
        </>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>📧 Contact Support</Text>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: theme.surface }]}
        onPress={() => {
          const cc = userEmail ? `&cc=${encodeURIComponent(userEmail)}` : "";
          const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Support request")}${cc}`;
          Linking.openURL(url).catch(() => Alert.alert("Cannot open mail client", "Please configure an email client on your device."));
        }}
      >
        <Text style={[styles.itemText, { color: theme.text }]}>📧 Contact Support</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>💡 Feedback / Report an Issue</Text>
      <View style={[styles.item, { backgroundColor: theme.surface, paddingBottom: 12 }]}> 
        <TextInput placeholder="Your name (optional)" placeholderTextColor="#999" value={feedbackName} onChangeText={setFeedbackName} style={[styles.input, { backgroundColor: theme.background, color: theme.text }]} />
        {userEmail ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: theme.muted }}>Your email</Text>
            <Text style={{ color: theme.text, marginTop: 4 }}>{userEmail}</Text>
          </View>
        ) : (
          <TextInput placeholder="Your email" placeholderTextColor="#999" value={feedbackName} onChangeText={setFeedbackName} style={[styles.input, { backgroundColor: theme.background, color: theme.text }]} />
        )}
        <TextInput placeholder="Describe your feedback or issue" placeholderTextColor="#999" value={feedbackMessage} onChangeText={setFeedbackMessage} style={[styles.input, { height: 100, backgroundColor: theme.background, color: theme.text }]} multiline />
        <TouchableOpacity
          style={[styles.button, { marginTop: 10, backgroundColor: "#E0AA3E" }]}
          onPress={() => {
            if (!feedbackMessage.trim()) { Alert.alert("Please write a message", "Describe the issue or feedback before sending."); return; }
            const subject = `App Feedback${feedbackName ? ` from ${feedbackName}` : ""}`;
            const emailForBody = userEmail || (feedbackName && feedbackName.includes("@") ? feedbackName : "");
            const fromLine = emailForBody ? `From: ${emailForBody}\n\n` : "";
            const body = `${fromLine}${feedbackMessage}\n\n--\nApp Version: 1.0.0`;
            const cc = emailForBody ? `&cc=${encodeURIComponent(emailForBody)}` : "";
            const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc}`;
            Linking.openURL(url).catch(() => Alert.alert("Cannot open mail client", "Please configure an email client on your device."));
          }}
        >
          <Text style={[styles.buttonText, { color: "#111" }]}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionBox}>
        <Text style={[styles.versionText, { color: theme.muted }]}>App Version: 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 20 },
  item: { padding: 15, backgroundColor: "#ffffff", borderRadius: 10, marginVertical: 8 },
  itemText: { color: "#0f172a", fontSize: 16 },
  sectionTitle: { color: "#374151", fontSize: 18, marginTop: 12, marginBottom: 8, fontWeight: "600" },
  itemOpen: { backgroundColor: "#f8fafc" },
  answerText: { color: "#374151", marginTop: 8 },
  input: { backgroundColor: "#f8fafc", color: "#0f172a", borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  button: { backgroundColor: "#E0AA3E", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#111", fontWeight: "700" },
  versionBox: { marginTop: 30, alignItems: "center" },
  versionText: { color: "#6b7280" },
});
