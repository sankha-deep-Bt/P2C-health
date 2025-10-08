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
    </DrawerContentScrollView>
  );
}
