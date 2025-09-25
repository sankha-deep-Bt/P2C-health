import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Upload } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/app/constants";
import { MedicalHistoryType } from "@/types/MedicalHistoryType";

export default function MedicalHistoryForm({ route }: any) {
  const { patientId } = route.params;

  const emptyForm: MedicalHistoryType = {
    chiefComplaints: [{ complaint: "", duration: "", order: "" }],
    historyOfPresentIllness: {
      symptoms: "",
      onset: "",
      duration: "",
      frequencyTiming: "",
      progression: "",
      location: "",
      radiation: "",
      character: "",
      severity: 0,
      associatedSymptoms: "",
      aggravatingFactors: "",
      relievingFactors: "",
      previousEpisodes: "",
      impact: "",
    },
    pastHistory: {
      conditions: [{ condition: "", date: "", cured: false }],
      trauma: "",
      bloodTransfusions: "",
      allergies: "",
      immunizations: "",
    },
    medications: {
      prescribed: [{ name: "", dosage: "", description: "" }],
      supplements: "",
      compliance: "",
      recentChanges: "",
    },
    familyHistory: {
      conditions: [""],
      familyHealthStatus: "",
      consanguinity: "",
    },
    documents: {
      reports: "",
      prescriptions: "",
      photos: "",
    },
  };

  const [form, setForm] = useState<MedicalHistoryType>(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        const res = await fetch(
          `${BASE_URL}/api/patients/${patientId}/health`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch medical history");
        const data = await res.json();
        if (data) setForm({ ...emptyForm, ...data });
      } catch (err: any) {
        Alert.alert("Error", err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [patientId]);

  const handleChange = (
    section: keyof MedicalHistoryType,
    field: string,
    value: any,
    index?: number
  ) => {
    setForm((prev) => {
      const sectionData = prev[section];
      if (Array.isArray(sectionData)) {
        const updatedArray = [...sectionData];
        if (index !== undefined) {
          updatedArray[index] = {
            ...(updatedArray[index] as any),
            [field]: value,
          };
        }
        return { ...prev, [section]: updatedArray };
      }
      if (sectionData && typeof sectionData === "object") {
        return { ...prev, [section]: { ...sectionData, [field]: value } };
      }
      return prev;
    });
  };

  const pickDocument = async (field: keyof MedicalHistoryType["documents"]) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success")
        handleChange("documents", field, result.uri);
    } catch (err) {
      console.log("Document Picker Error:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("refreshToken");
      const res = await fetch(`${BASE_URL}/api/patients/${patientId}/health`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save medical history");
      Alert.alert("Success", "Medical history saved successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card title="Medical History">
        {/* Chief Complaints */}
        <Text style={styles.sectionTitle}>Chief Complaints</Text>
        {form.chiefComplaints?.map((item, index) => (
          <View key={index}>
            <TextInput
              style={styles.input}
              placeholder="Complaint"
              value={item.complaint ?? ""}
              onChangeText={(v) =>
                handleChange("chiefComplaints", "complaint", v, index)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={item.duration ?? ""}
              onChangeText={(v) =>
                handleChange("chiefComplaints", "duration", v, index)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Order"
              value={item.order ?? ""}
              onChangeText={(v) =>
                handleChange("chiefComplaints", "order", v, index)
              }
            />
          </View>
        ))}

        {/* History of Present Illness */}
        <Text style={styles.sectionTitle}>History of Present Illness</Text>
        {Object.keys(form.historyOfPresentIllness ?? {}).map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field}
            value={
              form.historyOfPresentIllness[
                field as keyof typeof form.historyOfPresentIllness
              ] ?? ""
            }
            onChangeText={(v) =>
              handleChange("historyOfPresentIllness", field, v)
            }
          />
        ))}

        {/* Past History */}
        <Text style={styles.sectionTitle}>Past History</Text>
        <TextInput
          style={styles.input}
          placeholder="Trauma"
          value={form.pastHistory?.trauma ?? ""}
          onChangeText={(v) => handleChange("pastHistory", "trauma", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Blood Transfusions"
          value={form.pastHistory?.bloodTransfusions ?? ""}
          onChangeText={(v) =>
            handleChange("pastHistory", "bloodTransfusions", v)
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Allergies"
          value={form.pastHistory?.allergies ?? ""}
          onChangeText={(v) => handleChange("pastHistory", "allergies", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Immunizations"
          value={form.pastHistory?.immunizations ?? ""}
          onChangeText={(v) => handleChange("pastHistory", "immunizations", v)}
        />

        {/* Medications */}
        <Text style={styles.sectionTitle}>Medications</Text>
        {form.medications?.prescribed?.map((med, index) => (
          <View key={index}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={med.name ?? ""}
              onChangeText={(v) =>
                handleChange("medications", "name", v, index)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={med.dosage ?? ""}
              onChangeText={(v) =>
                handleChange("medications", "dosage", v, index)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={med.description ?? ""}
              onChangeText={(v) =>
                handleChange("medications", "description", v, index)
              }
            />
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Supplements"
          value={form.medications?.supplements ?? ""}
          onChangeText={(v) => handleChange("medications", "supplements", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Compliance"
          value={form.medications?.compliance ?? ""}
          onChangeText={(v) => handleChange("medications", "compliance", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Recent Changes"
          value={form.medications?.recentChanges ?? ""}
          onChangeText={(v) => handleChange("medications", "recentChanges", v)}
        />

        {/* Family History */}
        <Text style={styles.sectionTitle}>Family History</Text>
        <TextInput
          style={styles.input}
          placeholder="Family Health Status"
          value={form.familyHistory?.familyHealthStatus ?? ""}
          onChangeText={(v) =>
            handleChange("familyHistory", "familyHealthStatus", v)
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Consanguinity"
          value={form.familyHistory?.consanguinity ?? ""}
          onChangeText={(v) =>
            handleChange("familyHistory", "consanguinity", v)
          }
        />

        {/* Documents */}
        <Text style={styles.sectionTitle}>Documents</Text>
        {(
          ["reports", "prescriptions", "photos"] as Array<
            keyof MedicalHistoryType["documents"]
          >
        ).map((field) => (
          <TouchableOpacity
            key={field}
            style={styles.uploadButton}
            onPress={() => pickDocument(field)}
          >
            <Text style={styles.uploadText}>
              {(form.documents?.[field] as string)?.split("/").pop() ||
                `Upload ${field}`}
            </Text>
          </TouchableOpacity>
        ))}

        <Button onPress={handleSubmit} style={styles.sendButton}>
          Save Medical History
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { paddingVertical: 16, paddingHorizontal: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadText: { color: "#fff", fontSize: 16 },
  sendButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#28A745",
  },
});
