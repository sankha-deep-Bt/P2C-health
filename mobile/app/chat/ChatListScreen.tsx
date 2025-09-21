import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface Chat {
  _id: string;
  name: string; // could be doctor's name / patient's name
  lastMessage: string;
  updatedAt: string;
}

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch("http://localhost:3000/api/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChats(data || []);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!chats.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.noChats}>No chats available</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatScreen", { chatId: item._id.toString() })
      }
    >
      <Text style={styles.chatName}>{item.name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage || "No messages yet"}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noChats: { fontSize: 16, color: "#666" },
  chatItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  lastMessage: { fontSize: 14, color: "#666" },
  timestamp: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "right" },
});
