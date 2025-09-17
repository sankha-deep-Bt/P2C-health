// components/DashboardButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface DashboardButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export default function DashboardButton({
  label,
  onPress,
  color = "#007AFF",
  disabled = false,
}: DashboardButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
