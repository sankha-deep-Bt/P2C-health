import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState("/auth/login");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userType = await AsyncStorage.getItem("userType");

        if (token && userType) {
          if (userType === "doctor") {
            setRedirectTo("/doctor");
          } else {
            setRedirectTo("/patient");
          }
        } else {
          setRedirectTo("/auth/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setRedirectTo("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Redirect href={redirectTo as any} />;
}
