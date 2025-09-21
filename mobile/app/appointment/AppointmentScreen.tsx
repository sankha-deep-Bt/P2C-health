// app/Appointments/AppointmentsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

interface Appointment {
  _id: string;
  doctorName: string;
  date: string;
  status: "upcoming" | "completed" | "cancelled";
}

export default function AppointmentsScreen() {
  const route = useRoute<any>();
  const { patientId } = route.params || {};

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:3000/api/patients/${patientId}/appointments`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!doctorName || !date) {
      return Alert.alert("Error", "Doctor name and date are required.");
    }
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await fetch(
        `http://localhost:3000/api/patients/${patientId}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ doctorName, date }),
        }
      );
      Alert.alert("Success", "Appointment booked.");
      setDoctorName("");
      setDate("");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not book appointment.");
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await fetch(
        `http://localhost:3000/api/patients/${patientId}/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Cancelled", "Appointment cancelled.");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not cancel appointment.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Book new appointment */}
      <Text style={styles.heading}>Book New Appointment</Text>
      <TextInput
        placeholder="Doctor's Name"
        value={doctorName}
        onChangeText={setDoctorName}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Book Appointment" onPress={bookAppointment} />

      {/* Existing appointments */}
      <Text style={styles.heading}>Your Appointments</Text>
      {appointments.length === 0 ? (
        <Text>No appointments yet.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.bold}>{item.doctorName}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Status: {item.status}</Text>
              {item.status === "upcoming" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelAppointment(item._id)}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  bold: { fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    marginTop: 8,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});
