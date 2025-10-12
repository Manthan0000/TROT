// Frontend/app/register.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJson } from "../lib/api";
import { useTheme } from "./theme/ThemeContext";

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Join Us 🎉</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>Create your account</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={async () => {
          try {
            if (!name || !email || !password || password !== confirmPassword) return;
            const resp = await postJson("/api/auth/register", { name, email, password });
            const data = await resp.json();
            if (!resp.ok) {
              alert(data?.message || `Register failed (${resp.status})`);
              return;
            }
            if (data?.token) await AsyncStorage.setItem("authToken", data.token);
            if (data?.avatarUrl) {
              await AsyncStorage.setItem("avatarUrl", data.avatarUrl);
              (globalThis as any).__AVATAR_URL__ = data.avatarUrl;
            } else {
              await AsyncStorage.removeItem("avatarUrl");
              (globalThis as any).__AVATAR_URL__ = "";
            }
            if (data?.name) await AsyncStorage.setItem("userName", data.name);
            if (data?.email) await AsyncStorage.setItem("userEmail", data.email);
            (globalThis as any).__USER_NAME__ = data?.name || name;
            (globalThis as any).__USER_EMAIL__ = data?.email || email;
            router.push("/screens/Dashboard");
          } catch (e: any) {
            alert(e?.message || "Network error. Check API base and firewall.");
          }
        }}
      >
        <Text style={styles.primaryBtnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/login")}>
        <Text style={styles.secondaryBtnText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6F0",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryBtn: {
    backgroundColor: "#E0AA3E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: {
    backgroundColor: "#6DB193",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
