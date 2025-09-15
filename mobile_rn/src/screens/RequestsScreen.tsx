import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RequestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
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



