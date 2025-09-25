import React from "react";
import { View, Image, StyleSheet } from "react-native";

type AvatarProps = {
  uri?: string;
  size?: number;
  children?: React.ReactNode;
};

export const Avatar = ({ uri, size = 128, children }: AvatarProps) => {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
