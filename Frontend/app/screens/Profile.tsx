import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterBar from "../_components/Footerbar";

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const cachedAvatar = (globalThis as any).__AVATAR_URL__ || (await AsyncStorage.getItem("avatarUrl")) || "";
        const cachedName = (globalThis as any).__USER_NAME__ || (await AsyncStorage.getItem("userName")) || "";
        const cachedEmail = (globalThis as any).__USER_EMAIL__ || (await AsyncStorage.getItem("userEmail")) || "";
        setAvatarUrl(cachedAvatar);
        setName(cachedName);
        setEmail(cachedEmail);
      } catch {}
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : { uri: "https://i.pravatar.cc/120?img=5" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{name || "Your Name"}</Text>
          <Text style={styles.email}>{email || "your@email.com"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#E0AA3E" }]}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#6DB193" }]}>
          <Text style={styles.buttonText}>Add Skills</Text>
        </TouchableOpacity>
      </View>

      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#F7F9FC" },
  header: { flexDirection:"row", alignItems:"center", padding:16, gap:12 },
  avatar: { width:72, height:72, borderRadius:36, marginRight:12 },
  name: { fontSize:20, fontWeight:"700", color:"#111" },
  email: { fontSize:14, color:"#666" },
  actions: { padding:16, gap:12 },
  button: { paddingVertical:12, borderRadius:12, alignItems:"center" },
  buttonText: { color:"#fff", fontSize:16, fontWeight:"600" },
});
