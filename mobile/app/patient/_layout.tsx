import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "../constants";

// Drawer instance
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("refreshToken")}`,
        },
        body: JSON.stringify({}),
      });
      await AsyncStorage.multiRemove([
        "refreshToken",
        "accessToken",
        "userType",
      ]);

      router.replace("/auth/login");
      const text = await res.text();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Patient Portal</Text>
      </View>

      {/* Dynamic Drawer Items */}
      {props.state.routes.map((route, index) => {
        const { title, drawerIcon } = props.descriptors[route.key].options;
        return (
          <DrawerItem
            key={route.key}
            label={title ?? route.name}
            focused={props.state.index === index}
            onPress={() => props.navigation.navigate(route.name)}
            icon={({ color, size, focused }) =>
              drawerIcon ? drawerIcon({ color, size, focused }) : null
            }
          />
        );
      })}

      {/* Logout */}
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={({ color, size }) => (
          <Icon name="logout" size={size} color={color} />
        )}
        labelStyle={{ color: "#FF3B30" }}
      />
    </DrawerContentScrollView>
  );
}

export default function PatientLayout() {
  const [patientId, setPatientId] = React.useState<string | null>(null);
  const [patientName, setPatientName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadPatientId = async () => {
      const patient = await AsyncStorage.getItem("user");
      if (patient) {
        try {
          const parsed = JSON.parse(patient);
          setPatientId(parsed.id || parsed._id || null);
          setPatientName(parsed.name || null);
        } catch (e) {
          setPatientId(null);
          setPatientName(null);
        }
      }
    };
    loadPatientId();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Dashboard */}
      <Drawer.Screen
        name="PatientDashboard"
        component={require("./PatientDashboard").default}
        initialParams={{ patientId }}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />

      {/* Patient Information Form */}

      <Drawer.Screen
        name="PatientInformation"
        component={require("./(forms)/PatientInformation").default}
        initialParams={{ patientId }}
        options={{
          title: "Patient Information",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="MedicalReports"
        component={require("./(forms)/MedicalReports").default}
        initialParams={{ patientId }}
        options={{
          title: "Medical Reports",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ChatListScreen"
        component={require("../chat/ChatListScreen").default}
        initialParams={{ patientId }}
        options={{
          title: "Chat",
          drawerIcon: ({ color, size }) => (
            <Icon name="chat" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AppointmentsScreen"
        component={require("../appointment/DoctorListScreen").default}
        initialParams={{ patientId, patientName }}
        options={{
          title: "Appointments",
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 20, fontWeight: "bold" },
});
