import React from "react";
import { ScrollView } from "react-native";
import { useUser } from "@/hooks/useUser";
import { UserProfile } from "./UserProfile";
import { PatientDashboardContent } from "./PatientDashboardContents";
import styles from "./styles";

export default function PatientDashboard() {
  const { user, healthData } = useUser();

  return (
    <ScrollView style={styles.container}>
      {/* <Text>{JSON.stringify(healthData, null, 2)}</Text> */}
      {/* Always show user profile */}
      <UserProfile
        name={user?.name}
        uniqueId={user?.uniqueId}
        profilePic={user?.profilePic}
      />

      {/* Show health dashboard content */}
      <PatientDashboardContent
        healthData={healthData}
        onAddHealthData={() => {
          // navigate to health data form
        }}
      />
    </ScrollView>
  );
}
