import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";
import { jwtDecode } from "jwt-decode";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient"); // default: patient(user)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType,
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Register Failed", data.message || "Something went wrong");
        return;
      }

      Alert.alert("Success", "Account created successfully!");
      await AsyncStorage.setItem("token", data.refreshToken);
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem(
        "userType",
        jwtDecode<{ role: string }>(data.refreshToken).role
      );
      console.log(data.userType);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "doctor") {
        router.replace("/doctor");
      } else {
        router.replace("/patient");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to register");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* --- User Type Selection --- */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            userType === "patient" && styles.checkboxSelected,
          ]}
          onPress={() => setUserType("patient")}
        >
          <Text style={styles.checkboxText}>Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.checkbox,
            userType === "doctor" && styles.checkboxSelected,
          ]}
          onPress={() => setUserType("doctor")}
        >
          <Text style={styles.checkboxText}>Doctor</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Extra doctor fields */}
      {/* {userType === "doctor" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </>
      )}
     */}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  checkboxSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF20",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#007AFF", textAlign: "center", marginTop: 10 },
});
