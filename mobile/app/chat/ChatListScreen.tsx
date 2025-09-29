import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

type Chat = {
  id: string;
  name: string; // user or doctor name
  lastMessage: string;
  timestamp: string;
  profilePic?: string; // optional profile picture URL
};

export default function ChatListScreen({ navigation }: any) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // mock fetch chats (replace with API later)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // TODO: Replace this with API call
        const mockData: Chat[] = [
          {
            id: "1",
            name: "Dr. Sharma",
            lastMessage: "See you next week!",
            timestamp: "2025-09-25 14:30",
            profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            id: "2",
            name: "Dr. Singh",
            lastMessage: "Take the medicine regularly",
            timestamp: "2025-09-24 18:10",
            profilePic: "https://randomuser.me/api/portraits/men/44.jpg",
          },
          {
            id: "3",
            name: "Dr. Patel",
            lastMessage: "How are you feeling today?",
            timestamp: "2025-09-23 09:15",
            profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
          },
        ];
        setChats(mockData);
      } catch (err) {
        console.error("Error fetching chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      style={({ pressed }) => [
        styles.chatItem,
        { backgroundColor: pressed ? "#f0f0f0" : "#fff" },
      ]}
      onPress={() => navigation.navigate("ChatScreen", { chatId: item.id })}
    >
      <View style={styles.chatRow}>
        <Image
          source={{
            uri:
              item.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // fallback avatar
          }}
          style={styles.avatar}
        />
        <View style={styles.chatTextContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={renderChatItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  chatItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatTime: {
    fontSize: 12,
    color: "#888",
  },
  chatMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
