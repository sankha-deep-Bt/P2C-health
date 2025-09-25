import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

type ButtonProps = {
  onPress: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "outline";
  style?: any;
};

export const Button = ({
  onPress,
  children,
  disabled,
  loading,
  variant = "default",
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variant === "outline" ? styles.outline : styles.default,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#000" : "#fff"} />
      ) : typeof children === "string" ? (
        <Text
          style={[
            styles.text,
            variant === "outline" ? styles.textOutline : styles.textDefault,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  default: {
    backgroundColor: "#007bff",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textDefault: {
    color: "#fff",
  },
  textOutline: {
    color: "#007bff",
  },
  disabled: {
    opacity: 0.6,
  },
});
