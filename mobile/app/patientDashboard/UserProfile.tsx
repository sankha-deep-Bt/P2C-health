import React from "react";
import { View, Text, Image } from "react-native";
import { Card } from "@/components/Card";
import styles from "./styles";

interface UserProfileProps {
  name?: string;
  uniqueId?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, uniqueId }) => {
  return (
    <Card title="Patient Overview" iconName="👤">
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              (name || "Guest") +
              "&background=007AFF&color=fff",
          }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.boldText}>{name || "Guest User"}</Text>
          <Text style={styles.mutedText}>ID: {uniqueId || "N/A"}</Text>
        </View>
      </View>
    </Card>
  );
};
