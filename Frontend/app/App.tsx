// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screens
import Dashboard from "./screens/Dashboard";
import Creative from "./screens/batches/creative";
import Mentorships from "./screens/batches/mentorships";
import Music from "./screens/batches/music";
import Studies from "./screens/batches/studies";
import Competition from "./screens/batches/competition";
import More from "./screens/batches/more";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
      >
        {/* ✅ All routes must be registered here */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Creative" component={Creative} />
        <Stack.Screen name="Mentorships" component={Mentorships} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="Studies" component={Studies} />
        <Stack.Screen name="Competition" component={Competition} />
        <Stack.Screen name="More" component={More} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
