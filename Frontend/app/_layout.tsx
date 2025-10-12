// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack />
//   );
// }
// Frontend/app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider } from "./theme/ThemeContext";
import { LogBox } from "react-native";

// Disable development overlays that might show orange icons
LogBox.ignoreAllLogs(true);

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="screens/Dashboard" options={{ title: "Dashboard" }} />
        <Stack.Screen name="screens/Profile" options={{ title: "Profile" }} />
        <Stack.Screen name="screens/Session" options={{ title: "Session" }} />
        <Stack.Screen name="screens/Credits" options={{ title: "Credits" }} />
        <Stack.Screen name="screens/Settings" options={{ title: "Settings" }} />
      </Stack>
    </ThemeProvider>
  );
}
