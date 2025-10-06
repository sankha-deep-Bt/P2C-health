import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../constants";

// 🧩 Fallback messages
type Messages = {
  _id: string;
  content: string;
  isSender: boolean;
};

type FallbackMessages = {
  [key: string]: Messages[];
};

const fallbackMessages: FallbackMessages = {
  1: [
    { _id: "m1", content: "Hello, how are you feeling?", isSender: false },
    {
      _id: "m2",
      content: "I'm feeling better today, thank you.",
      isSender: true,
    },
    { _id: "m3", content: "Glad to hear that!", isSender: false },
  ],
  2: [
    {
      _id: "m1",
      content: "We should schedule your next visit.",
      isSender: false,
    },
    { _id: "m2", content: "Sure, next week works for me.", isSender: true },
  ],
  3: [
    { _id: "m1", content: "Remember to track your symptoms.", isSender: false },
    { _id: "m2", content: "I’ve been noting them daily.", isSender: true },
  ],
};

export default function ChatScreen() {
  const route = useRoute();
  const { chatId } = route.params as { chatId: string };

  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.warn("⚠️ Using fallback messages:", error);
      setMessages(fallbackMessages[chatId] || []);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const newMsg = {
      _id: Date.now().toString(),
      content: messageText,
      isSender: true,
    };

    // Show instantly in UI
    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/chats/${chatId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageText }),
      });

      if (!res.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.warn("⚠️ Message not sent to backend:", error);
    }
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.isSender ? styles.sent : styles.received,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
});
