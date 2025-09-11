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

import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import theme from "../theme/theme";


export default function Home() {
  const router = useRouter();

  return (

    <View style={styles.container}>
      <Image source={{ uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fskill-exchange&psig=AOvVaw02A_Ct8Gq1_0hw39W4SNJF&ust=1757578384646000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIjXlPDfzY8DFQAAAAAdAAAAABAL" }} style={{ width: 120, height: 120, borderRadius: 60 }} />

      <Text style={styles.title}>Welcome 👋</Text>

      <Pressable style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/register")}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    width: 200,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
});

