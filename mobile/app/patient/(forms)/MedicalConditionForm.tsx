// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as DocumentPicker from "expo-document-picker";
// import { BASE_URL } from "@/app/constants";

// type ChiefComplaint = { complaint: string; duration: string; order: string };
// type Condition = { condition: string; date: string; cured: boolean };
// type PrescribedMed = { name: string; dosage: string; description: string };

// export type MedicalHistoryType = {
//   [key: string]:
//     | string
//     | number
//     | {}
//     | null
//     | undefined
//     | ChiefComplaint[]
//     | Condition[]
//     | PrescribedMed[];
//   chiefComplaints: ChiefComplaint[];
//   historyOfPresentIllness: {
//     symptoms: string;
//     onset: string;
//     duration: string;
//     frequencyTiming: string;
//     progression: string;
//     location: string;
//     radiation: string;
//     character: string;
//     severity: number | null;
//     associatedSymptoms: string;
//     aggravatingFactors: string;
//     relievingFactors: string;
//     previousEpisodes: string;
//     impact: string;
//   };
//   pastHistory: {
//     conditions: Condition[];
//     trauma: string;
//     bloodTransfusions: string;
//     allergies: string;
//     immunizations: string;
//   };
//   medications: {
//     prescribed: PrescribedMed[];
//     supplements: string;
//     compliance: string;
//     recentChanges: string;
//   };
//   familyHistory: {
//     conditions: string[];
//     familyHealthStatus: string;
//     consanguinity: string;
//   };
//   documents: {
//     reports: string;
//     prescriptions: string;
//     photos: string;
//   };
// };

// const emptyForm: MedicalHistoryType = {
//   chiefComplaints: [],
//   historyOfPresentIllness: {
//     symptoms: "",
//     onset: "",
//     duration: "",
//     frequencyTiming: "",
//     progression: "",
//     location: "",
//     radiation: "",
//     character: "",
//     severity: null,
//     associatedSymptoms: "",
//     aggravatingFactors: "",
//     relievingFactors: "",
//     previousEpisodes: "",
//     impact: "",
//   },
//   pastHistory: {
//     conditions: [],
//     trauma: "",
//     bloodTransfusions: "",
//     allergies: "",
//     immunizations: "",
//   },
//   medications: {
//     prescribed: [],
//     supplements: "",
//     compliance: "",
//     recentChanges: "",
//   },
//   familyHistory: {
//     conditions: [],
//     familyHealthStatus: "",
//     consanguinity: "",
//   },
//   documents: {
//     reports: "",
//     prescriptions: "",
//     photos: "",
//   },
// };

// export default function MedicalConditionForm({
//   route,
//   navigation,
//   patientId,
// }: any) {
//   const [form, setForm] = useState<MedicalHistoryType>(emptyForm);
//   // const { patientId } = route.params;
//   const [loading, setLoading] = useState(false);

//   const pickDocument = async (field: keyof MedicalHistoryType["documents"]) => {
//     const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
//     if (String(result) === "success") {
//       setForm((prev) => ({
//         ...prev,
//         documents: { ...prev.documents, [field]: result },
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("accessToken");
//       const res = await fetch(`${BASE_URL}/api/patients/${patientId}/health`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error("Failed to save medical history");
//       Alert.alert("Success", "Medical report saved!", [
//         {
//           text: "View Reports",
//           onPress: () => navigation.navigate("MedicalReports", { patientId }),
//         },
//       ]);
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* === Chief Complaints === */}
//       <Text style={styles.sectionTitle}>Chief Complaints</Text>
//       {form.chiefComplaints.map((c, idx) => (
//         <View key={idx} style={styles.card}>
//           <TextInput
//             style={styles.input}
//             placeholder="Complaint"
//             value={c.complaint}
//             onChangeText={(text) => {
//               const updated = [...form.chiefComplaints];
//               updated[idx].complaint = text;
//               setForm({ ...form, chiefComplaints: updated });
//             }}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Duration"
//             value={c.duration}
//             onChangeText={(text) => {
//               const updated = [...form.chiefComplaints];
//               updated[idx].duration = text;
//               setForm({ ...form, chiefComplaints: updated });
//             }}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Order"
//             value={c.order}
//             onChangeText={(text) => {
//               const updated = [...form.chiefComplaints];
//               updated[idx].order = text;
//               setForm({ ...form, chiefComplaints: updated });
//             }}
//           />
//           <TouchableOpacity
//             style={styles.deleteBtn}
//             onPress={() => {
//               const updated = [...form.chiefComplaints];
//               updated.splice(idx, 1);
//               setForm({ ...form, chiefComplaints: updated });
//             }}
//           >
//             <Text style={styles.btnText}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//       <TouchableOpacity
//         style={styles.addBtn}
//         onPress={() =>
//           setForm({
//             ...form,
//             chiefComplaints: [
//               ...form.chiefComplaints,
//               { complaint: "", duration: "", order: "" },
//             ],
//           })
//         }
//       >
//         <Text style={styles.btnText}>+ Add Complaint</Text>
//       </TouchableOpacity>

//       {/* === History of Present Illness === */}
//       <Text style={styles.sectionTitle}>History of Present Illness</Text>
//       {Object.entries(form.historyOfPresentIllness).map(([field, value]) => {
//         const placeholders: Record<string, string> = {
//           symptoms: "Describe the main symptoms",
//           onset: "When did symptoms start?",
//           duration: "How long have you had the symptoms?",
//           frequencyTiming: "How often or when do symptoms occur?",
//           progression: "How have the symptoms changed over time?",
//           location: "Where is the symptom located?",
//           radiation: "Does the pain/symptom spread elsewhere?",
//           character: "Describe the nature of the symptom (e.g., sharp, dull)",
//           severity: "Rate the severity (1–10)",
//           associatedSymptoms: "Any other symptoms occurring with it?",
//           aggravatingFactors: "What makes it worse?",
//           relievingFactors: "What makes it better?",
//           previousEpisodes: "Have you experienced this before?",
//           impact: "How does this affect your daily life?",
//         };

//         return (
//           <TextInput
//             key={field}
//             style={styles.input}
//             placeholder={placeholders[field] || field}
//             value={String(value ?? "")}
//             onChangeText={(text) =>
//               setForm((prev) => ({
//                 ...prev,
//                 historyOfPresentIllness: {
//                   ...prev.historyOfPresentIllness,
//                   [field]: field === "severity" ? Number(text) : text,
//                 },
//               }))
//             }
//             keyboardType={field === "severity" ? "numeric" : "default"}
//           />
//         );
//       })}

//       {/* === Past History - Conditions === */}
//       <Text style={styles.sectionTitle}>Past History - Conditions</Text>
//       {form.pastHistory.conditions.map((cond, idx) => (
//         <View key={idx} style={styles.card}>
//           <TextInput
//             style={styles.input}
//             placeholder="Condition"
//             value={cond.condition}
//             onChangeText={(text) => {
//               const updated = [...form.pastHistory.conditions];
//               updated[idx].condition = text;
//               setForm({
//                 ...form,
//                 pastHistory: { ...form.pastHistory, conditions: updated },
//               });
//             }}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Date"
//             value={cond.date}
//             onChangeText={(text) => {
//               const updated = [...form.pastHistory.conditions];
//               updated[idx].date = text;
//               setForm({
//                 ...form,
//                 pastHistory: { ...form.pastHistory, conditions: updated },
//               });
//             }}
//           />
//           <TouchableOpacity
//             style={styles.deleteBtn}
//             onPress={() => {
//               const updated = [...form.pastHistory.conditions];
//               updated.splice(idx, 1);
//               setForm({
//                 ...form,
//                 pastHistory: { ...form.pastHistory, conditions: updated },
//               });
//             }}
//           >
//             <Text style={styles.btnText}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//       <TouchableOpacity
//         style={styles.addBtn}
//         onPress={() =>
//           setForm({
//             ...form,
//             pastHistory: {
//               ...form.pastHistory,
//               conditions: [
//                 ...form.pastHistory.conditions,
//                 { condition: "", date: "", cured: false },
//               ],
//             },
//           })
//         }
//       >
//         <Text style={styles.btnText}>+ Add Condition</Text>
//       </TouchableOpacity>

//       {/* === Documents === */}
//       <Text style={styles.sectionTitle}>Documents</Text>
//       {["reports", "prescriptions", "photos"].map((field) => (
//         <TouchableOpacity
//           key={field}
//           style={styles.uploadBtn}
//           onPress={() => pickDocument(field as any)}
//         >
//           <Text style={styles.btnText}>Upload {field}</Text>
//         </TouchableOpacity>
//       ))}

//       {/* === Save === */}
//       <TouchableOpacity
//         style={[styles.saveBtn, loading && { opacity: 0.7 }]}
//         onPress={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.btnText}>Save</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     marginVertical: 4,
//     borderRadius: 6,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 8,
//     marginVertical: 4,
//     borderRadius: 8,
//   },
//   addBtn: {
//     backgroundColor: "#007bff",
//     padding: 10,
//     borderRadius: 6,
//     marginVertical: 6,
//     alignItems: "center",
//   },
//   deleteBtn: {
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 6,
//     marginTop: 6,
//     alignItems: "center",
//   },
//   uploadBtn: {
//     backgroundColor: "#6c757d",
//     padding: 10,
//     borderRadius: 6,
//     marginVertical: 4,
//     alignItems: "center",
//   },
//   saveBtn: {
//     backgroundColor: "green",
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   btnText: { color: "#fff", fontWeight: "bold" },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { BASE_URL } from "@/app/constants";

type ChiefComplaint = { complaint: string; duration: string; order: string };
type Condition = { condition: string; date: string; cured: boolean };
type PrescribedMed = { name: string; dosage: string; description: string };

export type MedicalHistoryType = {
  [key: string]:
    | string
    | number
    | {}
    | null
    | undefined
    | ChiefComplaint[]
    | Condition[]
    | PrescribedMed[];
  chiefComplaints: ChiefComplaint[];
  historyOfPresentIllness: {
    symptoms: string;
    onset: string;
    duration: string;
    frequencyTiming: string;
    progression: string;
    location: string;
    radiation: string;
    character: string;
    severity: number | null;
    associatedSymptoms: string;
    aggravatingFactors: string;
    relievingFactors: string;
    previousEpisodes: string;
    impact: string;
  };
  pastHistory: {
    conditions: Condition[];
    trauma: string;
    bloodTransfusions: string;
    allergies: string;
    immunizations: string;
  };
  medications: {
    prescribed: PrescribedMed[];
    supplements: string;
    compliance: string;
    recentChanges: string;
  };
  familyHistory: {
    conditions: string[];
    familyHealthStatus: string;
    consanguinity: string;
  };
  documents: {
    reports: string;
    prescriptions: string;
    photos: string;
  };
};

const emptyForm: MedicalHistoryType = {
  chiefComplaints: [],
  historyOfPresentIllness: {
    symptoms: "",
    onset: "",
    duration: "",
    frequencyTiming: "",
    progression: "",
    location: "",
    radiation: "",
    character: "",
    severity: null,
    associatedSymptoms: "",
    aggravatingFactors: "",
    relievingFactors: "",
    previousEpisodes: "",
    impact: "",
  },
  pastHistory: {
    conditions: [],
    trauma: "",
    bloodTransfusions: "",
    allergies: "",
    immunizations: "",
  },
  medications: {
    prescribed: [],
    supplements: "",
    compliance: "",
    recentChanges: "",
  },
  familyHistory: {
    conditions: [],
    familyHealthStatus: "",
    consanguinity: "",
  },
  documents: {
    reports: "",
    prescriptions: "",
    photos: "",
  },
};

export default function MedicalConditionForm({
  patientId,
  onBack,
}: {
  patientId: string;
  onBack: () => void;
}) {
  const [form, setForm] = useState<MedicalHistoryType>(emptyForm);
  const [loading, setLoading] = useState(false);

  const pickDocument = async (field: keyof MedicalHistoryType["documents"]) => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (String(result) === "success") {
      setForm((prev) => ({
        ...prev,
        documents: { ...prev.documents, [field]: result },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/api/patients/${patientId}/health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save medical history");
      Alert.alert("Success", "Medical report saved!", [
        { text: "OK", onPress: onBack },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* === Chief Complaints === */}
      <Text style={styles.sectionTitle}>Chief Complaints</Text>
      {form.chiefComplaints.map((c, idx) => (
        <View key={idx} style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Complaint"
            value={c.complaint}
            onChangeText={(text) => {
              const updated = [...form.chiefComplaints];
              updated[idx].complaint = text;
              setForm({ ...form, chiefComplaints: updated });
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration"
            value={c.duration}
            onChangeText={(text) => {
              const updated = [...form.chiefComplaints];
              updated[idx].duration = text;
              setForm({ ...form, chiefComplaints: updated });
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Order"
            value={c.order}
            onChangeText={(text) => {
              const updated = [...form.chiefComplaints];
              updated[idx].order = text;
              setForm({ ...form, chiefComplaints: updated });
            }}
          />
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              const updated = [...form.chiefComplaints];
              updated.splice(idx, 1);
              setForm({ ...form, chiefComplaints: updated });
            }}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          setForm({
            ...form,
            chiefComplaints: [
              ...form.chiefComplaints,
              { complaint: "", duration: "", order: "" },
            ],
          })
        }
      >
        <Text style={styles.btnText}>+ Add Complaint</Text>
      </TouchableOpacity>

      {/* === History of Present Illness === */}
      <Text style={styles.sectionTitle}>History of Present Illness</Text>
      {Object.entries(form.historyOfPresentIllness).map(([field, value]) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          value={String(value ?? "")}
          onChangeText={(text) =>
            setForm((prev) => ({
              ...prev,
              historyOfPresentIllness: {
                ...prev.historyOfPresentIllness,
                [field]: field === "severity" ? Number(text) : text,
              },
            }))
          }
          keyboardType={field === "severity" ? "numeric" : "default"}
        />
      ))}

      {/* === Documents === */}
      <Text style={styles.sectionTitle}>Documents</Text>
      {["reports", "prescriptions", "photos"].map((field) => (
        <TouchableOpacity
          key={field}
          style={styles.uploadBtn}
          onPress={() => pickDocument(field as any)}
        >
          <Text style={styles.btnText}>Upload {field}</Text>
        </TouchableOpacity>
      ))}

      {/* === Save === */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Save</Text>
        )}
      </TouchableOpacity>
      {/* === Back Button === */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  backBtnText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 4,
    borderRadius: 6,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
