import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../auth/AuthProvider';

export default function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" onPress={logout} />
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


