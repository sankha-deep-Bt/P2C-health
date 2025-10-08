import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // make sure expo-vector-icons is installed
import { BASE_URL } from "../constants";

const fallbackChats = [
  {
    _id: "1",
    participantName: "Dr. Alice Johnson",
    lastMessage: { content: "Please take your medication on time." },
  },
  {
    _id: "2",
    participantName: "Dr. Rajesh Kumar",
    lastMessage: { content: "Let's schedule your follow-up for next week." },
  },
  {
    _id: "3",
    participantName: "Dr. Emily Carter",
    lastMessage: { content: "How are you feeling today?" },
  },
];

export default function ChatListScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch chats");

      const data = await res.json();
      if (data.length > 0) {
        setChats(data);
        setFilteredChats(data);
      } else {
        setChats([]);
        setFilteredChats([]);
      }
    } catch (error) {
      console.warn("⚠️ Using fallback chat data:", error);
      setChats(fallbackChats);
      setFilteredChats(fallbackChats);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
        chat.participantName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  const startNewChat = () => {
    // Placeholder — link this later to your "New Chat" screen
    alert("Start New Chat — to be implemented!");
  };

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatScreen", { chatId: item._id })}
    >
      <Text style={styles.chatName}>{item.participantName}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage?.content || "No messages yet"}
      </Text>
    </TouchableOpacity>
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
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <Text style={styles.noChats}>No chats found</Text>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
        />
      )}

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.fab} onPress={startNewChat}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  chatItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  lastMessage: { fontSize: 14, color: "#888", marginTop: 4 },
  noChats: { textAlign: "center", marginTop: 20, color: "#666" },

  // Floating Action Button (FAB)
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#4a90e2",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
