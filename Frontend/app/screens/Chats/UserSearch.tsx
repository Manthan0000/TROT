import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import SendChatRequest from "./SendChatRequest";
import { resolveApiBase, getJson } from "../../utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function UserSearch() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getJson(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to search users");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseRequest = () => {
    setSelectedUser(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.textSecondary + "30",
            },
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users by email or name..."
          placeholderTextColor={theme.textSecondary}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: "#007AFF" }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Found Users
      </Text>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No users found. Try searching with email or name.
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userItem,
                { backgroundColor: theme.surface, borderBottomColor: theme.textSecondary + "20" },
              ]}
              onPress={() => handleUserPress(item)}
            >
              <Image
                source={
                  item.avatarUrl
                    ? { uri: item.avatarUrl }
                    : require("../../../assets/images/default-avatar.jpg")
                }
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                  {item.email}
                </Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Request</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedUser && (
        <SendChatRequest
          receiverId={selectedUser._id}
          receiverName={selectedUser.name}
          visible={true}
          onClose={handleCloseRequest}
          onSuccess={() => {
            handleCloseRequest();
            Alert.alert("Success", "Chat request sent!");
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

