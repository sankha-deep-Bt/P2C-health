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
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getToken = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const userType = await AsyncStorage.getItem("userType");
    if (token) {
      if (userType === "doctor") {
        router.replace("/doctor" as any);
      } else {
        router.replace("/patient");
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error("Response was not valid JSON");
      }

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Something went wrong");
        return;
      }

      if (!data.refreshToken || !data.accessToken) {
        throw new Error("Server did not return tokens");
      }

      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem(
        "userType",
        jwtDecode<{ role: string }>(data.accessToken).role
      );
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Success", "Login successful!");

      const userType = await AsyncStorage.getItem("userType");
      // router.replace(userType === "doctor" ? "/doctor" : "/patient");
      if (userType === "doctor") {
        router.replace("/doctor" as any);
      } else {
        router.replace("/patient");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert("Error", error.message || "Failed to login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.link}>Don’t have an account? Register</Text>
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#007AFF", textAlign: "center", marginTop: 10 },
});
