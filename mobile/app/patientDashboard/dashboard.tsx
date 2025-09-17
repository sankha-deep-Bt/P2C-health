import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";

export default function DashboardScreen() {
  return (
    <View style={styles.screenContainer}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Patient Dashboard</Text>

          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="calendar-plus" size={24} color="#007AFF" />
                <Text style={styles.cardTitle}>Book Appointment</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="calendar-clock" size={24} color="#34C759" />
                <Text style={styles.cardTitle}>My Appointments</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="message" size={24} color="#FF9500" />
                <Text style={styles.cardTitle}>Chat with Doctor</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="account" size={24} color="#5856D6" />
                <Text style={styles.cardTitle}>Profile</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
