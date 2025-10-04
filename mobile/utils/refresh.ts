// utils/auth.ts
import { BASE_URL } from "@/app/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.log("⚠️ No refresh token found");
      return null;
    }

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) {
      console.log("❌ Failed to refresh token");
      return null;
    }

    const data = await res.json();

    if (data.accessToken) {
      await AsyncStorage.setItem("accessToken", data.accessToken);
      console.log("✅ Access token refreshed");
      return data.accessToken;
    }

    return null;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};

// Function to auto-refresh every 14 minutes
export const startTokenRefresh = () => {
  // Run once immediately
  refreshAccessToken();

  // Then every 14 minutes (14 * 60 * 1000 = 840000 ms)
  setInterval(() => {
    refreshAccessToken();
  }, 14 * 60 * 1000);
};
