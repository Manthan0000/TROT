import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "@/Frontend/app/theme/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteJson } from "../../utils/api";
import { Chat } from "@/Frontend/app/types/Chat";


interface ChatListProps {
  data: Chat[];
  onChatPress?: (chatId: string) => void;
  onDeleted?: (chatId: string) => void;
}

export default function ChatList({ data, onChatPress, onDeleted }: ChatListProps) {
  const { theme } = useTheme();
  const handleDelete = async (chatId: string) => {
    Alert.alert(
      "Delete chat",
      "This will permanently delete the conversation for you. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
              const res = await deleteJson(`/api/chat/${chatId}`, headers);
              if (res.ok) onDeleted?.(chatId);
            } catch {}
          },
        },
      ]
    );
  };

  const renderChat = ({ item }: { item: Chat }) => {
    // Get the other participant (not current user)
    const otherParticipant = item.participants[0];
    const lastMessage = item.lastMessage?.content || "No messages yet";
    const time = item.lastMessage?.createdAt
      ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.textSecondary + "20",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
          },
        ]}
        onPress={() => onChatPress?.(item._id)}
        onLongPress={() => handleDelete(item._id)}
      >
        <Image
          source={
            otherParticipant.avatarUrl
              ? { uri: otherParticipant.avatarUrl }
              : { uri: "https://i.pravatar.cc/100?img=4" }
          }
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.name, { color: theme.text }]}>
              {otherParticipant.name}
            </Text>
            {time ? (
              <Text style={[styles.time, { color: theme.textSecondary }]}>
                {time}
              </Text>
            ) : null}
          </View>
          <Text
            style={[styles.lastMessage, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        </View>
        <View style={styles.trailing}>
          {item.unreadCount && item.unreadCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: "#E0AA3E" }]}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderChat}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No chats yet. Start a conversation!
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  trailing: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: "#fee2e2" },
  deleteButtonText: { color: "#b91c1c", fontSize: 14 },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

