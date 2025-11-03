import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useTheme } from "@/Frontend/app/theme/ThemeContext";
import { postJson } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SendChatRequestProps {
  receiverId: string;
  receiverName: string;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SendChatRequest({
  receiverId,
  receiverName,
  visible,
  onClose,
  onSuccess,
}: SendChatRequestProps) {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!receiverId) {
      Alert.alert("Error", "Invalid user ID");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await postJson("/api/chat/request", {
        receiverId,
        message: message.trim() || "",
      }, headers);

      if (response.ok) {
        Alert.alert("Success", "Chat request sent successfully!");
        setMessage("");
        onClose();
        onSuccess?.();
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to send chat request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send chat request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Send Chat Request
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Request to chat with {receiverName}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Message (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.textSecondary + "30",
                },
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Why do you want to chat?"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>
              {message.length}/200
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.sendButton,
                loading && { opacity: 0.6 },
              ]}
              onPress={handleSendRequest}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>
                {loading ? "Sending..." : "Send Request"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#007AFF",
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

