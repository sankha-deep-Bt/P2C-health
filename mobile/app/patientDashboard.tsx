import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function PatientDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Even if logout fails on server, clear local storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userType");

      if (!response.ok) {
        const data = await response.json();
        console.warn("Server logout failed:", data.message || "Unknown error");
      }

      router.replace("/auth/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Dashboard</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>My Appointments</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Chat with Doctor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Logout button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#FF3B30", // red for logout
    marginTop: 30,
  },
});
