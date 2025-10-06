import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/app/constants";
import MedicalConditionForm from "./MedicalConditionForm";

export default function MedicalReports({ route, navigation }: any) {
  const { patientId } = route.params;
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch(
          `${BASE_URL}/api/patients/${patientId}/reports`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data); // no fallback
      } catch (err) {
        console.error(err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (showForm) {
    return (
      <MedicalConditionForm
        patientId={patientId}
        onBack={() => setShowForm(false)}
      />
    );
  }

  if (!reports.length) {
    return (
      <View style={styles.center}>
        <Text>No medical reports available.</Text>
        <TouchableOpacity
          style={styles.addReportBtn}
          // onPress={() => navigation.navigate("MedicalCondition", { patientId })}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addReportBtnText}>+ Add New Report</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sorted = [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const [present, ...past] = sorted;

  return (
    <ScrollView style={styles.container}>
      {/* Add New Report Button */}
      <TouchableOpacity
        style={styles.addReportBtn}
        // onPress={() => navigation.navigate("MedicalCondition", { patientId })}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.addReportBtnText}>+ Add New Report</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Present Medical Condition</Text>
      <View style={styles.presentCard}>
        <Text style={styles.symptom}>
          {present.historyOfPresentIllness?.symptoms || "No details"}
        </Text>
        <Text style={styles.timestamp}>
          Date: {new Date(present.timestamp).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.title}>Past Medical Conditions</Text>
      {past.map((p, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.card}
          onPress={() => navigation.navigate("ReportDetails", { report: p })}
        >
          <Text style={styles.symptom}>
            {p.historyOfPresentIllness?.symptoms || "No symptoms"}
          </Text>
          <Text style={styles.timestamp}>
            Date: {new Date(p.timestamp).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  presentCard: {
    backgroundColor: "#d1e7dd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  symptom: { fontSize: 16, fontWeight: "500" },
  timestamp: { fontSize: 12, color: "#555" },
  addReportBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addReportBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
