import React from "react";
import { View, Text, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./styles";
import { BASE_URL } from "../constants";

const navItems = [
  { id: "dashboard", icon: "view-dashboard", title: "Dashboard" },
  { id: "appointments", icon: "calendar", title: "Appointments" },
  { id: "chat", icon: "message", title: "Chat with Doctor" },
  { id: "profile", icon: "account", title: "Profile" },
];

export default function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const router = useRouter();

  // const handleLogout = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("refreshToken");

  //     if (!token) {
  //       console.log("token not found");
  //     }

  //     const res = await fetch(`${BASE_URL}/api/auth/logout`, {
  //       method: "POST",
  //       headers: {
  //         // "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       const errorData = data || {};
  //       throw new Error(errorData.message || "Logout failed");
  //     }

  //     await AsyncStorage.multiRemove([
  //       "refreshToken",
  //       "accessToken",
  //       "userType",
  //     ]);
  //     router.replace("/auth/login");
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert("Error", "Failed to logout. Please try again.");
  //   }
  // };
  const handleLogout = async () => {
    console.log("Logging out via:", `${BASE_URL}/api/auth/logout`);
    try {
      const token = await AsyncStorage.getItem("refreshToken");

      if (!token) {
        console.log("token not found");
      }

      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = null;
      try {
        data = await res.json(); // try parsing JSON
      } catch {
        data = null; // response was empty (e.g., 204 No Content)
      }

      if (res.status !== 204) {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Logout failed");
      }

      await AsyncStorage.multiRemove([
        "refreshToken",
        "accessToken",
        "userType",
      ]);
      router.replace("/auth/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Patient Portal</Text>
      </View>

      {state.routeNames.map((name: string, index: number) => (
        <DrawerItem
          key={name}
          label={navItems.find((item) => item.id === name)?.title || name}
          onPress={() => navigation.navigate(name)}
          icon={({ color, size }) => (
            <Icon
              name={navItems.find((item) => item.id === name)?.icon || "circle"}
              size={size}
              color={color}
            />
          )}
          focused={state.index === index}
          labelStyle={styles.drawerLabel}
        />
      ))}

      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <Icon name="logout" size={size} color={color} />
          )}
          labelStyle={[styles.drawerLabel, styles.logoutLabel]}
        />
      </View>
    </DrawerContentScrollView>
  );
}
