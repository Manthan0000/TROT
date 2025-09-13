import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkillsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skills</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
});



