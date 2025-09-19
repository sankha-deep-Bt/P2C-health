import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

export default function ChatScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Chat with Doctor</Text>
    </View>
  );
}
