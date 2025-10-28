import React from "react";
import { StyleSheet, View } from "react-native";
import FooterBar from "../_components/Footerbar";
import { ChatsDashboard } from "./Chats";

export default function Session() {
  return (
    <View style={styles.container}>
      <ChatsDashboard />
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
});

