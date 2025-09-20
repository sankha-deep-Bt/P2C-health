import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NetInfo from "@react-native-community/netinfo";
import CustomDrawerContent from "./CustomDrawer";

// import AppointmentsScreen from "./appointments";
// import ChatScreen from "./chat";
// import ProfileScreen from "./profile";
import styles from "./styles";
import DashboardScreen from "./dashboard";

const Drawer = createDrawerNavigator();

export default function PatientDashboardLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected || false);
    });

    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          drawerActiveBackgroundColor: "#E5F0FF",
          drawerActiveTintColor: "#007AFF",
          drawerInactiveTintColor: "#666",
        }}
      >
        <Drawer.Screen
          name=""
          component={DashboardScreen}
          options={{ title: "Dashboard" }}
        />
        {/* <Drawer.Screen
          name="appointments"
          component={AppointmentsScreen}
          options={{ title: "Appointments" }}
        />
        <Drawer.Screen
          name="chat"
          component={ChatScreen}
          options={{ title: "Chat with Doctor" }}
        />
        <Drawer.Screen
          name="profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        /> */}
      </Drawer.Navigator>
    </>
  );
}

// import React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
// import { Text, View, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// // Expo Router auto-loads screens inside app/patient/*
// // so you don’t need to import them manually here
// const Drawer = createDrawerNavigator();

// function CustomDrawerContent(props: any) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await AsyncStorage.multiRemove(["token", "userType"]);
//     router.replace("/auth/login");
//   };

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Patient Portal</Text>
//       </View>

//       {props.state.routeNames.map((name: string, index: number) => (
//         <DrawerItem
//           key={name}
//           label={name}
//           focused={props.state.index === index}
//           onPress={() => props.navigation.navigate(name)}
//           icon={({ color, size }) => (
//             <Icon
//               name={
//                 {
//                   dashboard: "view-dashboard",
//                   appointments: "calendar",
//                   chat: "message",
//                   profile: "account",
//                 }[name] || "circle"
//               }
//               size={size}
//               color={color}
//             />
//           )}
//         />
//       ))}

//       <DrawerItem
//         label="Logout"
//         onPress={handleLogout}
//         icon={({ color, size }) => (
//           <Icon name="logout" size={size} color={color} />
//         )}
//         labelStyle={{ color: "#FF3B30" }}
//       />
//     </DrawerContentScrollView>
//   );
// }

// export default function PatientLayout() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//     >
//       <Drawer.Screen
//         name="dashboard"
//         component={require("./dashboard").default}
//       />
//       <Drawer.Screen
//         name="appointments"
//         component={require("./appointments").default}
//       />
//       <Drawer.Screen name="chat" component={require("./chat").default} />
//       <Drawer.Screen name="profile" component={require("./profile").default} />
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
//   title: { fontSize: 20, fontWeight: "bold" },
// });
