import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DoctorListScreen from "./DoctorListScreen";
import AppointmentBookScreen from "./AppointmentBookScreen";
import UserAppointments from "./UserAppointments";

export default function AppointmentScreen({ route }: any) {
  const [role, setRole] = useState<string | null>(null);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const { patientId, patientName } = route.params || {};

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("userType");
      setRole(storedRole);
    };
    fetchRole();
  }, []);

  if (!role) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Booking flow
  if (showDoctorList) {
    return (
      <DoctorListScreen
        route={{ params: { patientId, patientName } }}
        onDoctorSelect={(doc: any) => {
          setSelectedDoctor(doc);
          setShowDoctorList(false);
        }}
      />
    );
  }

  if (selectedDoctor) {
    return (
      <AppointmentBookScreen
        patientId={patientId}
        patientName={patientName}
        doctorId={selectedDoctor._id}
        doctorName={selectedDoctor.name}
        onBack={() => {
          setSelectedDoctor(null);
        }}
      />
    );
  }

  // ✅ Default screen: Show Appointments + Book Button (only for patients)
  return (
    <View style={{ flex: 1 }}>
      <UserAppointments />

      {role === "patient" && (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setShowDoctorList(true)}
        >
          <Text style={styles.bookButtonText}>Book New Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
