import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";
import AppointmentScreen from "./AppointmentScreen";

type Doctor = {
  _id: string;
  name: string;
  specialization?: string;
  experience?: number;
};

export default function DoctorListScreen({ route }: any) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { patientId, patientName } = route.params;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/doctors/get-doctors`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.data || data); // handle both response shapes
      } catch (err: any) {
        Alert.alert("Error", err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // ✅ When showForm is true, show AppointmentScreen with selectedDoctor data
  if (showForm && selectedDoctor) {
    return (
      <AppointmentScreen
        patientId={patientId}
        patientName={patientName}
        doctorId={selectedDoctor._id}
        doctorName={selectedDoctor.name}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Available Doctors</Text>
      {doctors.map((doctor) => (
        <View key={doctor._id} style={styles.card}>
          <Text style={styles.name}>{doctor.name}</Text>

          <Text style={styles.detail}>
            {doctor.specialization || "General Practitioner"}
          </Text>
          <Text style={styles.detail}>
            Experience: {doctor.experience || 3} years
          </Text>

          {/* ✅ Clicking this sets the selected doctor before showing the form */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedDoctor(doctor);
              setShowForm(true);
            }}
          >
            <Text style={styles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  detail: {
    color: "#555",
    marginVertical: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
