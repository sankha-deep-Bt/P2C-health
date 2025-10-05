// screens/DoctorDashboard.tsx
import React from "react";
import { ScrollView } from "react-native";
import DoctorProfile from "./DoctorProfile";

const DoctorDashboard = () => {
  return (
    <ScrollView>
      <DoctorProfile />
    </ScrollView>
  );
};

export default DoctorDashboard;
