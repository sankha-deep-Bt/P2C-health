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
    await fetch(` ${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    });
    await AsyncStorage.multiRemove(["refreshToken", "accessToken", "userType"]);
    router.replace("/auth/login");
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

  React.useEffect(() => {
    const loadPatientId = async () => {
      const patient = await AsyncStorage.getItem("user");
      if (patient) {
        try {
          const parsed = JSON.parse(patient);
          setPatientId(parsed.id || parsed._id || null);
        } catch (e) {
          setPatientId(null);
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
        component={require("./forms/PatientInformation").default}
        initialParams={{ patientId }}
        options={{
          title: "Patient Information",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="MedicalHistory"
        component={require("./forms/MedicalHistory").default}
        initialParams={{ patientId }}
        options={{
          title: "Medical History",
          drawerIcon: ({ color, size }) => (
            <Icon name="file-document" size={size} color={color} />
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
