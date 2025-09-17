import React from "react";
import { View, Text, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./styles";

const navItems = [
  { id: "dashboard", icon: "view-dashboard", title: "Dashboard" },
  { id: "appointments", icon: "calendar", title: "Appointments" },
  { id: "chat", icon: "message", title: "Chat with Doctor" },
  { id: "profile", icon: "account", title: "Profile" },
];

export default function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`http://localhost:3000/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.multiRemove(["token", "userType"]);
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
