import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { resolveApiBase } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets, SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
}

export default function ChatScreen({ route }: any) {
  const localParams = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  // Support both classic route.params and Expo Router local params
  const routeParams = route?.params || {};
  const resolvedChatId = (routeParams.chatId as string) || (localParams?.chatId as string) || "";
  let resolvedParticipant: any = routeParams.participant ?? (localParams as any)?.participant;
  if (typeof resolvedParticipant === "string") {
    try {
      resolvedParticipant = JSON.parse(resolvedParticipant);
    } catch {}
  }
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [composerHeight, setComposerHeight] = useState<number>(64);

  useEffect(() => {
    (async () => {
      try {
        const uid = await AsyncStorage.getItem("userId");
        if (uid) setCurrentUserId(uid);
      } catch {}
    })();
    fetchMessages();
    // Poll for new messages
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [resolvedChatId]);

  const fetchMessages = async () => {
    try {
      const base = resolveApiBase();
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${base}/api/chat/${resolvedChatId}/messages`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setLoading(true);
      const base = resolveApiBase();
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${base}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          chatId: resolvedChatId,
          content: inputText.trim(),
        }),
      });

      if (response.ok) {
        setInputText("");
        await fetchMessages();
      } else {
        Alert.alert("Error", "Failed to send message");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    } finally {
      setLoading(false);
    }
  };


  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender._id === currentUserId;

    const currentDate = new Date(item.createdAt);
    const prev = messages[index - 1];
    const prevDate = prev ? new Date(prev.createdAt) : null;
    const isNewDay = !prevDate || prevDate.toDateString() !== currentDate.toDateString();

    return (
      <View>
        {isNewDay ? (
          <View style={styles.dateChipWrapper}>
            <Text style={styles.dateChipText}>
              {currentDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </Text>
          </View>
        ) : null}

        <View
          style={[
            styles.messageRow,
            { alignSelf: isMe ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isMe
                ? { backgroundColor: "#dcf8c6" } // WhatsApp sent
                : { backgroundColor: "#fff", borderColor: "#e0e0e0", borderWidth: 1 }, // received
            ]}
          >
            <Text style={[styles.messageText, { color: "#111" }]}>
              {item.content}
            </Text>
            <Text style={styles.messageTimeLight}>
              {currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaViewContext style={[styles.safeArea, { backgroundColor: theme.secondaryBackground }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight + insets.top : 0}
      >
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            style={styles.messagesList}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingTop: 24, paddingBottom: 24 }
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={true}
            onContentSizeChange={() => {
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToEnd({ animated: true });
                }
              }, 100);
            }}
            onLayout={() => {
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToEnd({ animated: false });
                }
              }, 100);
            }}
          />
        </View>
        
        <View
          style={[
            styles.inputContainer,
            { 
              backgroundColor: theme.background, 
              borderTopColor: theme.border || "#e0e0e0",
            },
          ]}
          onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
        >
          <View style={[styles.inputContent, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border || "#e0e0e0" }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={theme.muted || "#999"}
              multiline
              maxLength={500}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
              onPress={sendMessage}
              disabled={!inputText.trim() || loading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaViewContext>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 8,
  },
  messageRow: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
  },
  messageTimeLight: {
    fontSize: 10,
    alignSelf: "flex-end",
    color: "#6b7280",
  },
  dateChipWrapper: {
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 8,
  },
  dateChipText: {
    fontSize: 12,
    color: "#374151",
  },
  inputContainer: {
    borderTopWidth: 1,
    width: "100%",
  },
  inputContent: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#25D366",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

