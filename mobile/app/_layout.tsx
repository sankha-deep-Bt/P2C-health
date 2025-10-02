import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1E40AF" }, // blue header
        headerTintColor: "#fff", // white text/icons
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#f9fafb" }, // screen bg
      }}
    >
      {/* You can also configure specific screens */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="patient/PatientDashboard"
        options={{ title: "Patient", headerShown: false }}
      />
      <Stack.Screen
        name="doctor/DoctorDashboard"
        options={{ title: "Doctor", headerShown: false }}
      />
      <Stack.Screen
        name="chat/ChatListScreen"
        options={{ title: "Chat", headerShown: false }}
      />
    </Stack>
  );
}
