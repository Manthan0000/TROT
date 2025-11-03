import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "@/Frontend/app/theme/ThemeContext";

interface ChatRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  message: string;
  createdAt: string;
}

interface ChatRequestsProps {
  data: ChatRequest[];
  onAccept?: (requestId: string, request?: ChatRequest) => void;
  onReject?: (requestId: string, request?: ChatRequest) => void;
}

export default function ChatRequests({
  data,
  onAccept,
  onReject,
}: ChatRequestsProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return null;
  }

  const renderRequest = ({ item }: { item: ChatRequest }) => (
    <View
      style={[
        styles.requestItem,
        { backgroundColor: theme.surface, borderColor: theme.textSecondary + "20" },
      ]}
    >
      <Image
        source={
          item.sender.avatarUrl
            ? { uri: item.sender.avatarUrl }
            : { uri: "https://i.pravatar.cc/100?img=1" }
        }
        style={styles.avatar}
      />
      <View style={styles.requestInfo}>
        <Text style={[styles.name, { color: theme.text }]}> {item.sender.name} </Text>
        {item.message ? (
          <Text
            style={[styles.message, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
        ) : (
          <Text style={[styles.message, { color: theme.textSecondary }]}>wants to chat</Text>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.ctaButton, styles.acceptButton]}
            onPress={() => onAccept?.(item._id, item)}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>✓ Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButton, styles.rejectButton]}
            onPress={() => onReject?.(item._id, item)}
            activeOpacity={0.8}
          >
            <Text style={styles.rejectButtonText}>✕ Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Chat Requests</Text>
      <FlatList
        data={data}
        renderItem={renderRequest}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  requestItem: {
    width: 320,
    marginLeft: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: "#E0AA3E",
  },
  rejectButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
});

