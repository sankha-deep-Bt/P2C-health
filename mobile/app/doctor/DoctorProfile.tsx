import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from "../constants";

const DoctorProfile = () => {
  interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
  }

  interface DoctorData {
    name: string;
    email: string;
    specialization: string;
    qualification: string;
    bio: string;
    clinicName: string;
    experience: number;
    phone: string;
    patientList: string[];
    availability: AvailabilitySlot[];
    address: string;
    profilePic: string;
  }
  const [user, setUser] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(JSON.stringify(storedUser));
          // console.log("Loaded from storage:", parsed);

          // ensure correct nesting
          setUser(parsed.user || parsed);
          // console.log("user", user);
        }

        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const apiResponse = await res.json();
        // console.log("API response", apiResponse);

        // If your API returns { data: { ...doctorFields } }
        const doctor = apiResponse.data || apiResponse;

        // console.log("doctor", doctor.user.data);

        // Map directly without converting numbers to strings
        setUser({
          name: doctor.user.data.name,
          email: doctor.user.data.email,
          specialization: doctor.user.data.specialization,
          profilePic: doctor.user.data.profilePic,
          experience: doctor.user.data.experience,
          qualification: doctor.user.data.qualification,
          bio: doctor.user.data.bio,
          clinicName: doctor.user.data.clinicName,
          phone: doctor.user.data.phone,
          address: doctor.user.data.address,
          availability: doctor.user.data.availability || [],
          patientList: doctor.user.data.patientList || [],
        });

        // always store flattened doctor
        await AsyncStorage.setItem("user", JSON.stringify(doctor));
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No doctor data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header: Image + Name + Specialization */}
      <View style={styles.header}>
        {user.profilePic ? (
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.specialization}>{user.specialization}</Text>
        </View>
      </View>

      {/* Clinic Info */}
      {user.clinicName || user.address ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinic</Text>
          {user.clinicName ? <Text>{user.clinicName}</Text> : null}
          {user.address ? <Text>{user.address}</Text> : null}
        </View>
      ) : null}

      {/* Contact Info */}
      {user.phone ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text>{user.phone}</Text>
        </View>
      ) : null}

      {/* Experience & Qualification */}
      {(user.experience || user.qualification) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Info</Text>
          {user.qualification ? (
            <Text>Qualification: {user.qualification}</Text>
          ) : null}
          {user.experience ? (
            <Text>Experience: {user.experience} years</Text>
          ) : null}
        </View>
      )}

      {/* Bio */}
      {user.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text>{user.bio}</Text>
        </View>
      ) : null}

      {/* Availability */}
      {user.availability.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {user.availability.map((slot, index) => (
            <Text key={index}>
              {slot.day}: {slot.startTime} - {slot.endTime}
            </Text>
          ))}
        </View>
      )}

      {/* Patient List */}
      {user.patientList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patients</Text>
          <FlatList
            data={user.patientList}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Text>- {item}</Text>}
          />
        </View>
      )}
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  specialization: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
});
