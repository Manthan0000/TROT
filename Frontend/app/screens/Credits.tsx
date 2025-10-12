import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FooterBar from "../_components/Footerbar";
import { useTheme } from "../theme/ThemeContext";

export default function Credits() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Credits Screen</Text>
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:24, fontWeight:"bold" },
});
