import { View, Text } from "react-native";
import styles from "../patientDashboard/styles";

export default function ChatScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Chat Screen</Text>
      <View style={styles.content}>
        <Text>This is where the chat functionality will be implemented.</Text>
      </View>
    </View>
  );
}
