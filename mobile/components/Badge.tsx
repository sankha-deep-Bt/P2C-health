import React from "react";
import { View, Text, StyleSheet } from "react-native";

type BadgeProps = {
  text: string;
};

export const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#e9ecef",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#495057",
  },
});
