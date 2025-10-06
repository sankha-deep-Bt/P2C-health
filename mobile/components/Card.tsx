import React from "react";
import { View, Text, StyleSheet } from "react-native";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  iconName?: string; // pass emoji or icon string
};

export const Card: React.FC<CardProps> = ({ title, children, iconName }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {iconName && <Text style={styles.icon}>{iconName}</Text>}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardContent: {
    marginTop: 4,
  },
});
