import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Upload, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { reverseGeocode } from "@/utils/reverseGeocode";
import type { PatientType } from "@/types/PatientType";
import { BASE_URL } from "@/app/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PatientInformationForm({ route }: any) {
  const emptyPatient = {
    name: "",
    email: "",
    phone: "",
    age: 0,
    gender: "male",
    height: undefined,
    weight: undefined,
    avatar: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      district: "",
      state: "",
      postalCode: "",
    },
  };
  const { patientId, initialData } = route.params;
  const [form, setForm] = useState<PatientType | null>(
    initialData || emptyPatient
  );
  const [loading, setLoading] = useState(!initialData);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId || initialData) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/api/patients/${patientId}/patient-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem(
                "refreshToken"
              )}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch patient data");
        const data: PatientType = await res.json();
        setForm(data);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Unknown error");
      } finally {
        setLoading(false);
        return;
      }
    };
    fetchPatient();
  }, [patientId, initialData]);

  const sendForm = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/patients/${patientId}/patient-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem(
              "refreshToken"
            )}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed to update patient data");
      Alert.alert("Success", "Patient data updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unknown error");
    } finally {
      setLoading(false);
      return;
    }
  };

  if (loading || !form) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleFieldChange = (field: keyof PatientType | string, value: any) => {
    const newForm: PatientType = { ...form };
    if ((field as string).startsWith("address.")) {
      const addressField = (field as string).split(
        "."
      )[1] as keyof PatientType["address"];
      newForm.address = { ...newForm.address, [addressField]: value };
    } else {
      (newForm as any)[field] = value;
    }
    setForm(newForm);
  };

  const handleAvatarChange = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please grant photo permissions");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        handleFieldChange("avatar", base64Image);
      }
    } catch (error) {
      Alert.alert("Image Upload Error", "Failed to upload image");
    }
  };

  const handleFetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Permission Required", "Please grant permissions");
        return;
      }

      setIsFetchingLocation(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const address: any = await reverseGeocode(latitude, longitude);

      if (address) {
        handleFieldChange("address.line1", address.line1);
        handleFieldChange("address.line2", address.line2 || "");
        handleFieldChange("address.city", address.city);
        handleFieldChange("address.district", address.district);
        handleFieldChange("address.state", address.state);
        handleFieldChange("address.postalCode", address.postalCode);
      }

      Alert.alert("Location Found", "Address filled automatically");
    } catch (error: any) {
      Alert.alert("Location Error", error.message || "Unknown error");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
    >
      <Card title="Patient Information">
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Avatar uri={form.avatar}>
            {!form.avatar && <User size={64} color="gray" />}
          </Avatar>
          <Button
            variant="outline"
            onPress={handleAvatarChange}
            style={styles.uploadButton}
          >
            <Upload size={16} color="blue" />
            <Text style={styles.uploadText}>Upload</Text>
          </Button>
        </View>

        {/* Basic Info */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name ?? ""}
          onChangeText={(v) => handleFieldChange("name", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email ?? ""}
          onChangeText={(v) => handleFieldChange("email", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={form.phone ?? ""}
          onChangeText={(v) => handleFieldChange("phone", v)}
        />

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Address</Text>
        {["line1", "line2", "city", "district", "postalCode", "state"].map(
          (field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field}
              value={form.address?.[field] ?? ""}
              onChangeText={(v) => handleFieldChange(`address.${field}`, v)}
            />
          )
        )}
        <Button
          onPress={handleFetchLocation}
          disabled={isFetchingLocation}
          style={styles.locationButton}
        >
          {isFetchingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            "Fetch Location"
          )}
        </Button>

        {/* Other Fields */}
        <Text style={styles.sectionTitle}>Age</Text>

        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={form.age?.toString() ?? ""}
          onChangeText={(v) => handleFieldChange("age", Number(v))}
        />

        {/* Gender Picker */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => handleFieldChange("gender", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Height with unit selector */}
        <Text style={styles.sectionTitle}>Height</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Height"
            keyboardType="numeric"
            value={form.height?.toString() ?? ""}
            onChangeText={(v) => handleFieldChange("height", Number(v))}
          />
          <View style={styles.unitPicker}>
            <Picker
              selectedValue={form.height || "cm"}
              onValueChange={(value) => handleFieldChange("heightUnit", value)}
            >
              <Picker.Item label="cm" value="cm" />
              <Picker.Item label="ft" value="ft" />
            </Picker>
          </View>
        </View>

        {/* Weight with unit selector */}
        <Text style={styles.sectionTitle}>Weight</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Weight"
            keyboardType="numeric"
            value={form.weight?.toString() ?? ""}
            onChangeText={(v) => handleFieldChange("weight", Number(v))}
          />
          <View style={styles.unitPicker}>
            <Picker
              selectedValue={form.weight || "kg"}
              onValueChange={(value) => handleFieldChange("weightUnit", value)}
            >
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="lbs" value="lbs" />
            </Picker>
          </View>
        </View>

        <Button onPress={sendForm} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Save</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  locationButton: {
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  sendButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#28A745",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },

  unitPicker: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 60, // fixed width
    height: 60, // fixed height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  squareBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },

  picker: {
    height: 50,
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
