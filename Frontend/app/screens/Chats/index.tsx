import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text, TextInput } from "react-native";
import ChatList from "./ChatList";
import ChatRequests from "./ChatRequests";
import UserSearch from "./UserSearch";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeContext";
import { resolveApiBase, getJson, patchJson } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ChatsDashboard() {
  const { theme } = useTheme();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const uid = await AsyncStorage.getItem("userId");
        if (uid) setCurrentUserId(uid);
      } catch {}
    })();
    fetchData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const base = resolveApiBase();
      const token = await AsyncStorage.getItem("authToken");
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const chatRes = await getJson("/api/chat/user/me", headers);
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setChats(chatData);
        setFilteredChats(chatData);
      }

      const reqRes = await getJson("/api/chat/requests", headers);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleChatPress = (chatId: string) => {
    // Get the chat details to find the participant
    const chat = chats.find((c) => c._id === chatId);
    if (chat) {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUserId
      );
      if (otherParticipant) {
        navigation.navigate("screens/Chats/ChatScreen" as never, {
          chatId,
          participant: otherParticipant,
        } as never);
      }
    }
  };

  const handleAcceptRequest = async (requestId: string, request?: any) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await patchJson(`/api/chat/request/${requestId}`, {
        action: "accept",
      }, headers);

      if (response.ok) {
        // Navigate to the created chat if backend returns it or refetch to find it
        try {
          const data = await response.json();
          const chatId = data?.chat?._id;
          const participant = request?.sender;
          if (chatId && participant) {
            navigation.navigate("screens/Chats/ChatScreen" as never, { chatId, participant } as never);
            fetchData();
            return;
          }
        } catch {}
        // Fallback: refresh lists
        fetchData();
      } else {
        Alert.alert("Error", "Failed to accept chat request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to accept chat request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await patchJson(`/api/chat/request/${requestId}`, {
        action: "reject",
      }, headers);

      if (response.ok) {
        fetchData();
      } else {
        Alert.alert("Error", "Failed to reject chat request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reject chat request");
    }
  };

  // Search within chats
  const handleChatSearch = (query: string) => {
    setChatSearchQuery(query);
    if (!query.trim()) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter((chat) => {
      const participant = chat.participants.find((p) => p._id !== currentUserId);
      if (!participant) return false;
      
      const nameMatch = participant.name?.toLowerCase().includes(query.toLowerCase());
      const emailMatch = participant.email?.toLowerCase().includes(query.toLowerCase());
      const lastMessageMatch = chat.lastMessage?.content?.toLowerCase().includes(query.toLowerCase());
      
      return nameMatch || emailMatch || lastMessageMatch;
    });

    setFilteredChats(filtered);
  };

  if (showSearch) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => setShowSearch(false)}
        >
          <Text style={[styles.backButtonText, { color: theme.text }]}>
            ← Back to Chats
          </Text>
        </TouchableOpacity>
        <UserSearch />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chats</Text>
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: "#E0AA3E" }]}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.newChatButtonText}>+ New Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.surface }]}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search chats..."
          placeholderTextColor={theme.textSecondary}
          value={chatSearchQuery}
          onChangeText={handleChatSearch}
        />
      </View>

      <ChatRequests
        data={requests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
      <ChatList
        data={filteredChats}
        onChatPress={handleChatPress}
        onDeleted={(chatId: string) => {
          setChats((prev) => prev.filter((c: any) => c._id !== chatId));
          setFilteredChats((prev) => prev.filter((c: any) => c._id !== chatId));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  newChatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newChatButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  backButton: {
    padding: 16,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
