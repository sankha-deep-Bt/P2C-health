import { useRouter } from "expo-router";
import React from "react";

export default function PatientDashboardIndex() {
  const router = useRouter();
  // Redirect to /dashboard automatically
  React.useEffect(() => {
    router.replace("/patient");
  }, []);

  return null; // or a loading spinner
}
