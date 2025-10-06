// Frontend/app/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJson } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={async () => {
          try {
            const resp = await postJson("/api/auth/login", { email, password });
            const data = await resp.json();
            if (!resp.ok) {
              alert(data?.message || `Login failed (${resp.status})`);
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
            (globalThis as any).__USER_NAME__ = data?.name || (globalThis as any).__USER_NAME__;
            (globalThis as any).__USER_EMAIL__ = data?.email || (globalThis as any).__USER_EMAIL__;
            router.push("/screens/Dashboard");
          } catch (e: any) {
            alert(e?.message || "Network error. Check API base and firewall.");
          }
        }}
      >
        <Text style={styles.primaryBtnText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/register")}>
        <Text style={styles.secondaryBtnText}>Create an Account</Text>
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
