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
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

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
  const [selectedDate, setSelectedDate] = useState<string>(""); // calendar date
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    if (!selectedDoctor || !selectedDate) {
      Alert.alert("Missing fields", "Please select doctor and date");
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
      <View style={styles.doctorList}>
        {doctors.map((doc) => (
          <TouchableOpacity
            key={doc._id}
            style={[
              styles.doctorCard,
              selectedDoctor?._id === doc._id && styles.selectedDoctor,
            ]}
            onPress={() => setSelectedDoctor(doc)}
          >
            <Text
              style={{
                color: selectedDoctor?._id === doc._id ? "#fff" : "#333",
                fontWeight: "600",
              }}
            >
              {doc.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Date</Text>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          const pickedDate = new Date(day.dateString);
          setDate(
            new Date(pickedDate.setHours(date.getHours(), date.getMinutes()))
          );
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: "#007bff",
          },
        }}
        theme={{
          todayTextColor: "#28a745",
          arrowColor: "#007bff",
        }}
      />

      <Text style={styles.label}>Select Time</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.dateText}>
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setDate(selectedTime);
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
        style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
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
    color: "#333",
  },
  doctorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  doctorCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  selectedDoctor: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  dateBtn: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    elevation: 3,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// import React, { useEffect, useState } from "react";
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

// type Doctor = {
//   _id: string;
//   name: string;
// };

// export default function AppointmentScreen({ route }: any) {
//   const { patientId, patientName } = route.params;

//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

//   const [date, setDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<string>(""); // calendar date
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   const [reason, setReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch doctors list
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const token = await AsyncStorage.getItem("refreshToken");
//         const res = await fetch(`${BASE_URL}/api/doctors`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch doctors");
//         const data = await res.json();
//         setDoctors(data);
//       } catch (err: any) {
//         Alert.alert("Error", err.message || "Unknown error");
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   const handleSubmit = async () => {
//     if (!selectedDoctor || !selectedDate) {
//       Alert.alert("Missing fields", "Please select doctor and date");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem("refreshToken");
//       const payload = {
//         doctorId: selectedDoctor._id,
//         doctorName: selectedDoctor.name,
//         patientId,
//         patientName,
//         date,
//         reason,
//         status: "pending",
//       };
//       const res = await fetch(`${BASE_URL}/api/appointments`, {
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
//       setSelectedDoctor(null);
//       setSelectedDate("");
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Unknown error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loadingDoctors) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Step 1: Select Doctor */}
//       <Text style={styles.label}>Select Doctor</Text>
//       <View style={styles.doctorList}>
//         {doctors.map((doc) => (
//           <TouchableOpacity
//             key={doc._id}
//             style={[
//               styles.doctorCard,
//               selectedDoctor?._id === doc._id && styles.selectedDoctor,
//             ]}
//             onPress={() => {
//               setSelectedDoctor(doc);
//               setSelectedDate("");
//               setReason("");
//             }}
//           >
//             <Text
//               style={{
//                 color: selectedDoctor?._id === doc._id ? "#fff" : "#333",
//                 fontWeight: "600",
//               }}
//             >
//               {doc.name}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Step 2: Calendar appears only if doctor selected */}
//       {selectedDoctor && (
//         <>
//           <Text style={styles.label}>Select Date</Text>
//           <Calendar
//             minDate={new Date().toISOString().split("T")[0]} // disable past dates
//             onDayPress={(day) => {
//               setSelectedDate(day.dateString);
//               const pickedDate = new Date(day.dateString);
//               setDate(
//                 new Date(
//                   pickedDate.setHours(date.getHours(), date.getMinutes())
//                 )
//               );
//             }}
//             markedDates={{
//               [selectedDate]: {
//                 selected: true,
//                 marked: true,
//                 selectedColor: "#007bff",
//               },
//             }}
//             theme={{
//               todayTextColor: "#28a745",
//               arrowColor: "#007bff",
//             }}
//           />
//         </>
//       )}

//       {/* Step 3: Time + reason only appear if date chosen */}
//       {selectedDate && (
//         <>
//           <Text style={styles.label}>Select Time</Text>
//           <TouchableOpacity
//             style={styles.dateBtn}
//             onPress={() => setShowTimePicker(true)}
//           >
//             <Text style={styles.dateText}>
//               {date.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </Text>
//           </TouchableOpacity>

//           {showTimePicker && (
//             <DateTimePicker
//               value={date}
//               mode="time"
//               display="default"
//               onChange={(_, selectedTime) => {
//                 setShowTimePicker(false);
//                 if (selectedTime) setDate(selectedTime);
//               }}
//             />
//           )}

//           <Text style={styles.label}>Reason</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter reason"
//             value={reason}
//             onChangeText={setReason}
//           />

//           <TouchableOpacity
//             style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
//             onPress={handleSubmit}
//             disabled={submitting}
//           >
//             <Text style={styles.submitText}>
//               {submitting ? "Booking..." : "Book Appointment"}
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginVertical: 8,
//     color: "#333",
//   },
//   doctorList: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   doctorCard: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     marginVertical: 4,
//     backgroundColor: "#f9f9f9",
//     elevation: 2,
//   },
//   selectedDoctor: {
//     backgroundColor: "#007bff",
//     borderColor: "#007bff",
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
