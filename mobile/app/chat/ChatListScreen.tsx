import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { BASE_URL } from "../constants";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  profilePic?: string;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  profilePic?: string;
};

export default function ChatListScreen({ navigation }: any) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDoctors, setShowDoctors] = useState(false);

  const fallbackDoctors: Doctor[] = [
    {
      id: "101",
      name: "Dr. Sharma",
      specialty: "Cardiologist",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "102",
      name: "Dr. Singh",
      specialty: "General Physician",
      profilePic: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      id: "103",
      name: "Dr. Patel",
      specialty: "Dermatologist",
      profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem(
              "accessToken"
            )}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch chats`);

        const data = await response.json();
        if (data.length > 0) {
          setChats(data);
          setShowDoctors(false);
        } else {
          setShowDoctors(true);
        }
      } catch (err) {
        console.error("Error fetching chats", err);
        setShowDoctors(true); // fallback to doctor list if fetch fails
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
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
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

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <Pressable
      style={({ pressed }) => [
        styles.chatItem,
        { backgroundColor: pressed ? "#f0f0f0" : "#fff" },
      ]}
      onPress={() => navigation.navigate("ChatScreen", { doctorId: item.id })}
    >
      <View style={styles.chatRow}>
        <Image
          source={{
            uri:
              item.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.chatTextContainer}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatMessage}>{item.specialty}</Text>
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

  // return (
  //   <FlatList
  //     data={showDoctors ? fallbackDoctors : chats}
  //     keyExtractor={(item: any) => item.id}
  //     renderItem={showDoctors ? renderDoctorItem : renderChatItem}
  //     contentContainerStyle={styles.list}
  //     ItemSeparatorComponent={() => <View style={styles.separator} />}
  //     ListHeaderComponent={
  //       showDoctors ? (
  //         <Text style={styles.headerText}>
  //           No chats yet. Start a conversation with a doctor:
  //         </Text>
  //       ) : undefined
  //     }
  //   />
  // );
  // type Chat | Doctor = Chat | Doctor;
  return (
    <FlatList
      data={
        showDoctors
          ? fallbackDoctors
          : chats.map((item: Chat | Doctor) => item as Chat)
      }
      keyExtractor={(item: Chat | Doctor) => item.id}
      renderItem={({ item }: { item: Chat }) => renderChatItem({ item })}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        showDoctors ? (
          <Text style={styles.headerText}>
            No chats yet. Start a conversation with a doctor:
          </Text>
        ) : undefined
      }
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
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
});
