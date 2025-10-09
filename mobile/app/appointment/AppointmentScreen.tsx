// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Calendar } from "react-native-calendars";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL } from "../constants";

// export default function AppointmentScreen({
//   patientId,
//   patientName,
//   doctorId,
//   doctorName,
//   onBack,
// }: any) {
//   const [date, setDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [reason, setReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (!selectedDate) {
//       Alert.alert(
//         "Missing fields",
//         "Please select a date for your appointment"
//       );
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       const payload = {
//         doctorId,
//         doctorName,
//         patientId,
//         patientName,
//         date,
//         reason,
//         status: "pending",
//       };

//       const res = await fetch(`${BASE_URL}/api/appointment/book`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to book appointment");

//       Alert.alert("Success", "Appointment booked successfully!");
//       setReason("");
//       setSelectedDate("");
//       if (onBack) onBack(); // go back to doctor list
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Unknown error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Back Button */}
//       <TouchableOpacity style={styles.backBtn} onPress={onBack}>
//         <Text style={styles.backText}>← Back</Text>
//       </TouchableOpacity>

//       {/* Doctor Info */}
//       <View style={styles.doctorCard}>
//         <Text style={styles.label}>Booking with:</Text>
//         <Text style={styles.doctorName}>{doctorName}</Text>
//       </View>

//       {/* Date Picker */}
//       <Text style={styles.label}>Select Date</Text>
//       <Calendar
//         onDayPress={(day) => {
//           setSelectedDate(day.dateString);
//           const pickedDate = new Date(day.dateString);
//           setDate(
//             new Date(pickedDate.setHours(date.getHours(), date.getMinutes()))
//           );
//         }}
//         markedDates={{
//           [selectedDate]: {
//             selected: true,
//             marked: true,
//             selectedColor: "#007bff",
//           },
//         }}
//         theme={{
//           todayTextColor: "#28a745",
//           arrowColor: "#007bff",
//         }}
//       />

//       {/* Time Picker */}
//       <Text style={styles.label}>Select Time</Text>
//       <TouchableOpacity
//         style={styles.dateBtn}
//         onPress={() => setShowTimePicker(true)}
//       >
//         <Text style={styles.dateText}>
//           {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//         </Text>
//       </TouchableOpacity>

//       {showTimePicker && (
//         <DateTimePicker
//           value={date}
//           mode="time"
//           display="default"
//           onChange={(_, selectedTime) => {
//             setShowTimePicker(false);
//             if (selectedTime) setDate(selectedTime);
//           }}
//         />
//       )}

//       {/* Reason Input */}
//       <Text style={styles.label}>Reason</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter reason"
//         value={reason}
//         onChangeText={setReason}
//       />

//       {/* Submit Button */}
//       <TouchableOpacity
//         style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
//         onPress={handleSubmit}
//         disabled={submitting}
//       >
//         {submitting ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.submitText}>Book Appointment</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   backBtn: {
//     alignSelf: "flex-start",
//     marginBottom: 10,
//   },
//   backText: {
//     color: "#007bff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   doctorCard: {
//     backgroundColor: "#f1f9ff",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: "#007bff",
//   },
//   doctorName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginVertical: 8,
//     color: "#333",
//   },
//   dateBtn: {
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     marginVertical: 8,
//     backgroundColor: "#f9f9f9",
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginVertical: 8,
//     fontSize: 16,
//     backgroundColor: "#fff",
//   },
//   submitBtn: {
//     backgroundColor: "#28a745",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 16,
//     elevation: 3,
//   },
//   submitText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

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

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/appointments`, {
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
