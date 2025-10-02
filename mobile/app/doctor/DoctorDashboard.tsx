// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import styles from "./styles";
// import { Link, useRouter } from "expo-router";

// export default function DashboardScreen() {
//   const router = useRouter();
//   const [user, setUser] = useState<{
//     name: string;
//     email: string;
//     specialization: string;
//     profilePic: string;
//   } | null>(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       const storedUser = await AsyncStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     };
//     loadUser();
//   }, []);

//   return (
//     <View style={styles.screenContainer}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* 🔹 Profile Section */}
//         <View style={styles.profileSection}>
//           <Image
//             source={{
//               uri:
//                 "https://ui-avatars.com/api/?name=" +
//                 (user?.name || "Guest") +
//                 "&background=007AFF&color=fff",
//             }}
//             style={styles.avatar}
//           />
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
//             <Text style={styles.profileSubtitle}>
//               {user?.specialization || ""}
//             </Text>
//           </View>
//         </View>

//         {/* 🔹 Cards (vertical stack) */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Icon name="calendar-plus" size={24} color="#007AFF" />
//             <Text style={styles.cardTitle}>Complete Profile</Text>
//           </View>
//         </View>
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Icon name="calendar-plus" size={24} color="#007AFF" />
//             <Text style={styles.cardTitle}>File a Report</Text>
//           </View>
//         </View>

//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Icon name="calendar-clock" size={24} color="#34C759" />
//             <Text style={styles.cardTitle}>My Appointments</Text>
//           </View>
//         </View>

//         <TouchableOpacity onPress={() => router.push("./ChatScreen")}>
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Icon name="message" size={24} color="#FF9500" />
//               <Text style={styles.cardTitle}>Chat</Text>
//             </View>
//           </View>
//         </TouchableOpacity>

//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Icon name="account" size={24} color="#5856D6" />
//             <Text style={styles.cardTitle}>Profile</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

type Appointment = {
  _id: string;
  patientName: string;
  date: string;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/appointments/doctor`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Update appointment status
  const updateStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const token = await AsyncStorage.getItem("refreshToken");
      const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Doctor Dashboard</Text>

      {appointments.length === 0 ? (
        <Text style={styles.noData}>No appointments yet.</Text>
      ) : (
        appointments.map((a) => (
          <View key={a._id} style={styles.card}>
            <Text style={styles.name}>Patient: {a.patientName}</Text>
            <Text style={styles.text}>
              Date: {new Date(a.date).toLocaleString()}
            </Text>
            {a.reason ? (
              <Text style={styles.text}>Reason: {a.reason}</Text>
            ) : null}
            <Text style={styles.status}>Status: {a.status}</Text>

            <View style={styles.actions}>
              {a.status === "pending" && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#007bff" }]}
                  onPress={() => updateStatus(a._id, "confirmed")}
                >
                  <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>
              )}

              {a.status !== "cancelled" && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#dc3545" }]}
                  onPress={() => updateStatus(a._id, "cancelled")}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              )}

              {a.status === "confirmed" && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#28a745" }]}
                  onPress={() => updateStatus(a._id, "completed")}
                >
                  <Text style={styles.btnText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  text: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, marginVertical: 6, fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 8 },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
