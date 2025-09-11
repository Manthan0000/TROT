import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FooterBar from "../_components/Footerbar";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
  title: { fontSize:24, fontWeight:"bold" },
});
