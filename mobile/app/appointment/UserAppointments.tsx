import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

type Appointment = {
  _id: string;
  doctorId: { name?: string } | string;
  doctorName: string;
  patientId: { name?: string } | string;
  patientName: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export default function UserAppointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/appointment`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchAppointments(); // refresh list
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    }
  };

  const deleteAppointment = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("accessToken");
            const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete appointment");
            fetchAppointments(); // refresh list
          } catch (err: any) {
            Alert.alert("Error", err.message || "Unknown error");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!appointments.length) {
    return (
      <View style={styles.center}>
        <Text>No appointments found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      {appointments.map((appt) => (
        <View key={appt._id} style={styles.card}>
          <Text style={styles.name}>
            Doctor:{" "}
            {typeof appt.doctorId === "object"
              ? appt.doctorId.name
              : appt.doctorName}
          </Text>
          <Text style={styles.name}>
            Patient:{" "}
            {typeof appt.patientId === "object"
              ? appt.patientId.name
              : appt.patientName}
          </Text>
          <Text style={styles.detail}>
            Date: {new Date(appt.date).toLocaleString()}
          </Text>
          <Text style={styles.detail}>Status: {appt.status}</Text>

          {/* Buttons */}
          <View style={styles.actions}>
            {["pending", "confirmed", "cancelled", "completed"].map(
              (s) =>
                s !== appt.status && (
                  <TouchableOpacity
                    key={s}
                    style={styles.statusBtn}
                    onPress={() => updateStatus(appt._id, s)}
                  >
                    <Text style={styles.statusBtnText}>{s}</Text>
                  </TouchableOpacity>
                )
            )}

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteAppointment(appt._id)}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  detail: {
    color: "#555",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  statusBtn: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  statusBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
