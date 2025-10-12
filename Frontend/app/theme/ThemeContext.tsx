import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  border: string;
  secondaryBackground: string;
  error: string;
};

const LIGHT_THEME: Theme = {
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#1a202c",
  muted: "#4a5568",
  primary: "#00e0ff",
  border: "#e2e8f0",
  secondaryBackground: "#f1f5f9",
  error: "#e53e3e",
};

const DARK_THEME: Theme = {
  background: "#0d1117",
  surface: "#161b22",
  text: "#f0f6fc",
  muted: "#8b949e",
  primary: "#00e0ff",
  border: "#30363d",
  secondaryBackground: "#21262d",
  error: "#f85149",
};

const STORAGE_KEY = "darkMode";

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
  theme: Theme;
}>({ 
  isDark: false, 
  toggleTheme: () => {}, 
  theme: LIGHT_THEME 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setIsDark(stored === "true");
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, isDark.toString()).catch(() => {});
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
