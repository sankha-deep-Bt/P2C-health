import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import { Link, useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    specialization: string;
    profilePic: string;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 🔹 Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                "https://ui-avatars.com/api/?name=" +
                (user?.name || "Guest") +
                "&background=007AFF&color=fff",
            }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
            <Text style={styles.profileSubtitle}>
              {user?.specialization || ""}
            </Text>
          </View>
        </View>

        {/* 🔹 Cards (vertical stack) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="calendar-plus" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Complete Profile</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="calendar-plus" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>File a Report</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="calendar-clock" size={24} color="#34C759" />
            <Text style={styles.cardTitle}>My Appointments</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("./ChatScreen")}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="message" size={24} color="#FF9500" />
              <Text style={styles.cardTitle}>Chat</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="account" size={24} color="#5856D6" />
            <Text style={styles.cardTitle}>Profile</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
