import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface DoctorProfileProps {
  name: string;
  specialization: string;
  profilePic?: string;
  clinicAddress?: string;
  availability?: AvailabilitySlot[];
  experience?: string | number;
  qualification?: string;
  contact?: string;
  bio?: string;
  clinicName?: string;
  patientList?: string[];
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({
  name,
  specialization,
  profilePic,
  clinicAddress,
  availability = [],
  experience,
  qualification,
  contact,
  bio,
  clinicName,
  patientList = [],
}) => {
  console.log("DoctorProfile props:", {
    name,
    specialization,
    profilePic,
    clinicAddress,
    availability,
    experience,
    qualification,
    contact,
    bio,
    clinicName,
    patientList,
  });

  return (
    <View style={styles.container}>
      {/* Header: Image + Name + Specialization */}
      <View style={styles.header}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialization}>{specialization}</Text>
        </View>
      </View>

      {/* Clinic Info */}
      {clinicName || clinicAddress ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinic</Text>
          {clinicName ? <Text>{clinicName}</Text> : null}
          {clinicAddress ? <Text>{clinicAddress}</Text> : null}
        </View>
      ) : null}

      {/* Contact Info */}
      {contact ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text>{contact}</Text>
        </View>
      ) : null}

      {/* Experience & Qualification */}
      {(experience || qualification) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Info</Text>
          {qualification ? <Text>Qualification: {qualification}</Text> : null}
          {experience ? <Text>Experience: {experience} years</Text> : null}
        </View>
      )}

      {/* Bio */}
      {bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text>{bio}</Text>
        </View>
      ) : null}

      {/* Availability */}
      {availability.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {availability.map((slot, index) => (
            <Text key={index}>
              {slot.day}: {slot.startTime} - {slot.endTime}
            </Text>
          ))}
        </View>
      )}

      {/* Patient List */}
      {patientList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patients</Text>
          <FlatList
            data={patientList}
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
