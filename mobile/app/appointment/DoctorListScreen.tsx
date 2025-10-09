// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL } from "../constants";
// import AppointmentScreen from "./AppointmentScreen";

// type Doctor = {
//   _id: string;
//   name: string;
//   specialization?: string;
//   experience?: number;
// };

// export default function DoctorListScreen({ route }: any) {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

//   const { patientId, patientName } = route.params;

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const token = await AsyncStorage.getItem("refreshToken");
//         const res = await fetch(`${BASE_URL}/api/doctors/get-doctors`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch doctors");
//         const data = await res.json();
//         setDoctors(data.data || data); // handle both response shapes
//       } catch (err: any) {
//         Alert.alert("Error", err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   }

//   // ✅ When showForm is true, show AppointmentScreen with selectedDoctor data
//   if (showForm && selectedDoctor) {
//     return (
//       <AppointmentScreen
//         patientId={patientId}
//         patientName={patientName}
//         doctorId={selectedDoctor._id}
//         doctorName={selectedDoctor.name}
//         onBack={() => setShowForm(false)}
//       />
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Available Doctors</Text>
//       {doctors.map((doctor) => (
//         <View key={doctor._id} style={styles.card}>
//           <Text style={styles.name}>{doctor.name}</Text>

//           <Text style={styles.detail}>
//             {doctor.specialization || "General Practitioner"}
//           </Text>
//           <Text style={styles.detail}>
//             Experience: {doctor.experience || 3} years
//           </Text>

//           {/* ✅ Clicking this sets the selected doctor before showing the form */}
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               setSelectedDoctor(doctor);
//               setShowForm(true);
//             }}
//           >
//             <Text style={styles.buttonText}>Book Appointment</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
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
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 12,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   detail: {
//     color: "#555",
//     marginVertical: 4,
//   },
//   button: {
//     marginTop: 10,
//     backgroundColor: "#28a745",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

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

type Appointment = {
  _id: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  date: string;
  reason?: string;
  status: string;
};

export default function DoctorListScreen({ route }: any) {
  const [role, setRole] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { patientId, patientName } = route.params || {};

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        const storedRole = await AsyncStorage.getItem("userType"); // ✅ using your stored role

        if (!token || !storedRole) {
          Alert.alert("Error", "User not logged in");
          return;
        }

        setRole(storedRole);

        if (storedRole === "patient") {
          const res = await fetch(`${BASE_URL}/api/doctors/get-doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setDoctors(data.data || data);
        }

        if (storedRole === "doctor") {
          const res = await fetch(`${BASE_URL}/api/appointment`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setAppointments(data.data || data);
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // ✅ Patient View: Show doctors
  if (role === "patient") {
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

  // ✅ Doctor View: Show appointments
  if (role === "doctor") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Appointments</Text>
        {appointments.length === 0 ? (
          <Text>No appointments yet.</Text>
        ) : (
          appointments.map((appt) => (
            <View key={appt._id} style={styles.card}>
              <Text style={styles.name}>Patient: {appt.patientName}</Text>
              <Text style={styles.detail}>
                Date: {new Date(appt.date).toLocaleString()}
              </Text>
              <Text style={styles.detail}>Reason: {appt.reason || "N/A"}</Text>
              <Text style={styles.detail}>Status: {appt.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#007bff" },
  detail: { color: "#555", marginVertical: 4 },
  button: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
