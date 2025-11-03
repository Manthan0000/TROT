// // Frontend/app/index.tsx
// import { StyleSheet, Text, View } from "react-native";

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to MovieApp 🎬</Text>
//       <Text style={styles.subtitle}>This is the Home Screen (index.tsx)</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#121212",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#bbb",
//   },
// });

// Frontend/app/index.tsx
// import { useRouter } from "expo-router";
// import { Button, StyleSheet, Text, View } from "react-native";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome 👋</Text>
//       <Button title="Login" onPress={() => router.push("/login")} />
//       <Button title="Register" onPress={() => router.push("/register")} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
// });

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
}

