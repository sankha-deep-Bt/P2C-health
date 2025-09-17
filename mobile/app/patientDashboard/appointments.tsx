import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

export default function AppointmentsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>My Appointments</Text>
    </View>
  );
}
