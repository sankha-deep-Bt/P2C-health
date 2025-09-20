import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

export default function MedicalHistoryForm({ route }: any) {
  const { patientId, healthData } = route.params;
  const [form, setForm] = useState<any>(healthData?.medicalHistory || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (section: string, key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: { ...(prev?.[section] || {}), [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/patients/${patientId}/health`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medicalHistory: form }),
        }
      );
      if (res.ok) {
        Alert.alert("✅ Success", "Medical history updated!");
      } else {
        Alert.alert("❌ Error", "Could not save data");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.section}>History of Present Illness</Text>
      {Object.keys(form?.historyOfPresentIllness || {}).map((key) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={String(form?.historyOfPresentIllness?.[key] || "")}
            onChangeText={(val) =>
              handleChange("historyOfPresentIllness", key, val)
            }
          />
        </View>
      ))}

      <Text style={styles.section}>Past History</Text>
      {Object.keys(form?.pastHistory || {}).map((key) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={String(form?.pastHistory?.[key] || "")}
            onChangeText={(val) => handleChange("pastHistory", key, val)}
          />
        </View>
      ))}

      <Text style={styles.section}>Medications</Text>
      {Object.keys(form?.medications || {}).map((key) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={String(form?.medications?.[key] || "")}
            onChangeText={(val) => handleChange("medications", key, val)}
          />
        </View>
      ))}

      <Text style={styles.section}>Family History</Text>
      {Object.keys(form?.familyHistory || {}).map((key) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={String(form?.familyHistory?.[key] || "")}
            onChangeText={(val) => handleChange("familyHistory", key, val)}
          />
        </View>
      ))}

      <Text style={styles.section}>Documents</Text>
      {Object.keys(form?.documents || {}).map((key) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={String(form?.documents?.[key] || "")}
            onChangeText={(val) => handleChange("documents", key, val)}
          />
        </View>
      ))}

      <Button
        title={saving ? "Saving..." : "Save Medical History"}
        onPress={handleSave}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  field: { marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },
});
