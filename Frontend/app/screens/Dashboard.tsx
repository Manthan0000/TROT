import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FooterBar from "../_components/Footerbar";
import Header from "../_components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const cached = (globalThis as any).__USER_NAME__ || (await AsyncStorage.getItem("userName"));
        if (cached) setUserName(cached);
      } catch {}
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Header userName={userName} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}> </Text>
      </ScrollView>
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});