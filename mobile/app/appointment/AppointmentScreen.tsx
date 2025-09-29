// // app/Appointments/AppointmentsScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Button,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRoute } from "@react-navigation/native";

// interface Appointment {
//   _id: string;
//   doctorName: string;
//   date: string;
//   status: "upcoming" | "completed" | "cancelled";
// }

// export default function AppointmentScreen() {
//   const route = useRoute<any>();
//   const { patientId } = route.params || {};

//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [doctorName, setDoctorName] = useState("");
//   const [date, setDate] = useState("");

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("accessToken");
//       const res = await fetch(
//         `http://localhost:3000/api/patients/${patientId}/appointments`,
//         {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch appointments");
//       }
//       const data = await res.json();
//       setAppointments(data || []);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bookAppointment = async () => {
//     if (!doctorName || !date) {
//       return Alert.alert("Error", "Doctor name and date are required.");
//     }
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       await fetch(
//         `http://localhost:3000/api/patients/${patientId}/appointments`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ doctorName, date }),
//         }
//       );
//       Alert.alert("Success", "Appointment booked.");
//       setDoctorName("");
//       setDate("");
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Could not book appointment.");
//     }
//   };

//   const cancelAppointment = async (id: string) => {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       await fetch(
//         `http://localhost:3000/api/patients/${patientId}/appointments/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       Alert.alert("Cancelled", "Appointment cancelled.");
//       fetchAppointments();
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Could not cancel appointment.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text>Loading appointments...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Book new appointment */}
//       <Text style={styles.heading}>Book New Appointment</Text>
//       <TextInput
//         placeholder="Doctor's Name"
//         value={doctorName}
//         onChangeText={setDoctorName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Date (YYYY-MM-DD)"
//         value={date}
//         onChangeText={setDate}
//         style={styles.input}
//       />
//       <Button title="Book Appointment" onPress={bookAppointment} />

//       {/* Existing appointments */}
//       <Text style={styles.heading}>Your Appointments</Text>
//       {appointments.length === 0 ? (
//         <Text>No appointments yet.</Text>
//       ) : (
//         <FlatList
//           data={appointments}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <Text style={styles.bold}>{item.doctorName}</Text>
//               <Text>Date: {item.date}</Text>
//               <Text>Status: {item.status}</Text>
//               {item.status === "upcoming" && (
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => cancelAppointment(item._id)}
//                 >
//                   <Text style={{ color: "white" }}>Cancel</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#fff" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   heading: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   card: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   bold: { fontWeight: "bold", fontSize: 16 },
//   cancelButton: {
//     marginTop: 8,
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 6,
//     alignItems: "center",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://YOUR_BACKEND_URL"; // replace with your backend

type Doctor = {
  _id: string;
  name: string;
};

export default function AppointmentScreen({ route }: any) {
  const { patientId, patientName } = route.params;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/doctors`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data);
        if (data.length > 0) setSelectedDoctor(data[0]);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Unknown error");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      Alert.alert("Select a doctor");
      return;
    }
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("refreshToken");
      const payload = {
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        patientId,
        patientName,
        date,
        reason,
        status: "pending",
      };
      const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to book appointment");
      Alert.alert("Success", "Appointment booked successfully!");
      setReason("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctors) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Doctor</Text>
      {doctors.map((doc) => (
        <TouchableOpacity
          key={doc._id}
          style={[
            styles.doctorItem,
            selectedDoctor?._id === doc._id && styles.selectedDoctor,
          ]}
          onPress={() => setSelectedDoctor(doc)}
        >
          <Text
            style={{
              color: selectedDoctor?._id === doc._id ? "#fff" : "#000",
            }}
          >
            {doc.name}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Select Date & Time</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason"
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Booking..." : "Book Appointment"}
        </Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  doctorItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedDoctor: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  dateBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
