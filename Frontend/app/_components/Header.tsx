import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HeaderProps = {
  userName?: string;
};

export default function Header({ userName = "" }: HeaderProps) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>((globalThis as any).__AVATAR_URL__ || Image.resolveAssetSource(require("../../assets/images/default-avatar.jpg")).uri);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const next = (globalThis as any).__AVATAR_URL__;
        if (typeof next === "string" && next.length > 0) {
          setAvatarUrl(next);
          return;
        }
        const cached = await AsyncStorage.getItem("avatarUrl");
        if (cached) setAvatarUrl(cached);
      })();
    }, [])
  );

  const [displayName, setDisplayName] = useState<string>(userName || (globalThis as any).__USER_NAME__ || "");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (!displayName) {
            const cachedName = await AsyncStorage.getItem("userName");
            if (cachedName) setDisplayName(cachedName);
          }
        } catch {}
      })();
    }, [displayName])
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>TROT</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="inbox" size={22} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../screens/Profile")}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greetingWrap}>
        <Text style={styles.greetLineOne}>Hi, {displayName || "User"}</Text>
        <Text style={styles.greetLineTwo}>Unlock Your Career</Text>
      </View>

      <View style={styles.searchBar}>
        <Entypo name="magnifying-glass" size={18} color="#6b7280" />
        <TextInput
          placeholder="Search Opportunities"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#eef6ff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: "#ffffff" },
  avatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 6 },
  greetingWrap: { marginBottom: 12 },
  greetLineOne: { fontSize: 28, fontWeight: "700", color: "#0f172a" },
  greetLineTwo: { fontSize: 24, fontWeight: "600", color: "#0f172a" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { marginLeft: 8, flex: 1, color: "#111827" },
});


