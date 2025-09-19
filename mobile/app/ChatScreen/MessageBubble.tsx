import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

type Props = {
  text: string;
  sender: string;
};

export default function MessageBubble({ text, sender }: Props) {
  const isDoctor = sender === "doctor";

  return (
    <View
      style={[
        styles.messageBubble,
        isDoctor ? styles.doctorBubble : styles.patientBubble,
      ]}
    >
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
}
