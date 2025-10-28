import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { deleteJson } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ChatScreenHeaderProps {
  route?: any;
  options?: any;
}

export default function ChatScreenHeader({ route, options }: ChatScreenHeaderProps) {
  const router = useRouter();
  const localParams = useLocalSearchParams();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);

  const routeParams = route?.params || {};
  const resolvedChatId = (routeParams.chatId as string) || (localParams?.chatId as string) || "";
  let resolvedParticipant: any = routeParams.participant ?? (localParams as any)?.participant;
  if (typeof resolvedParticipant === "string") {
    try {
      resolvedParticipant = JSON.parse(resolvedParticipant);
    } catch {}
  }

  const clearChat = async () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages in this chat? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowMenu(false),
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
              const response = await deleteJson(`/api/chat/${resolvedChatId}/messages`, headers);

              if (response.ok) {
                setShowMenu(false);
                Alert.alert("Success", "Chat cleared successfully");
              } else {
                const data = await response.json().catch(() => ({}));
                Alert.alert("Error", data.error || "Failed to clear chat");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to clear chat");
            }
          },
        },
      ]
    );
  };

  const deleteChat = async () => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat? All messages will be permanently deleted. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowMenu(false),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
              const response = await deleteJson(`/api/chat/${resolvedChatId}`, headers);

              if (response.ok) {
                setShowMenu(false);
                Alert.alert("Success", "Chat deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]);
              } else {
                const data = await response.json().catch(() => ({}));
                Alert.alert("Error", data.error || "Failed to delete chat");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete chat");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={[styles.header, { 
        backgroundColor: theme.background, 
        borderBottomColor: theme.border || "#e0e0e0",
        paddingTop: Math.max(insets.top, 0),
      }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          
          {resolvedParticipant && (
            <View style={styles.headerInfo}>
              <Image
                source={
                  resolvedParticipant.avatarUrl
                    ? { uri: resolvedParticipant.avatarUrl }
                    : require("../../../assets/images/default-avatar.jpg")
                }
                style={styles.headerAvatar}
              />
              <Text style={[styles.headerName, { color: theme.text }]} numberOfLines={1}>
                {resolvedParticipant.name || resolvedParticipant.email || "Chat"}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            onPress={() => setShowMenu(true)}
            style={styles.menuButton}
          >
            <Text style={[styles.menuIcon, { color: theme.text }]}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Options Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.border || "#e0e0e0" }]}
              onPress={clearChat}
            >
              <Text style={[styles.menuItemText, { color: theme.text }]}>Clear Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={deleteChat}
            >
              <View style={styles.menuItemRow}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                <Text style={[styles.menuItemText, { color: "#dc2626", marginLeft: 12 }]}>Delete Chat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemCancel, { borderTopColor: theme.border || "#e0e0e0" }]}
              onPress={() => setShowMenu(false)}
            >
              <Text style={[styles.menuItemText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
    transform: [{ rotate: "90deg" }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: "80%",
    maxWidth: 300,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemCancel: {
    borderBottomWidth: 0,
    borderTopWidth: 1,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 16,
    textAlign: "center",
  },
});

