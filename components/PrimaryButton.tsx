import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  variant?: "filled" | "outlined";
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  icon,
  iconPosition = "left",
  variant = "filled",
  disabled = false,
  fullWidth = true,
  size = "medium",
  style,
}: PrimaryButtonProps) {
  const sizeClasses = {
    small: "py-2 px-4",
    medium: "py-3 px-6",
    large: "py-4 px-8",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const iconSize = size === "small" ? 16 : size === "medium" ? 20 : 24;
  const isFilled = variant === "filled";
  const backgroundColor = isFilled ? "#0A9D5C" : "transparent";
  const textColor = isFilled ? "#FFFFFF" : "#0A9D5C";
  const borderColor = isFilled ? "transparent" : "#0A9D5C";
  const shadowStyle = isFilled
    ? {
        shadowColor: "#0A9D5C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }
    : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-full ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`}
      style={[
        {
          backgroundColor,
          borderWidth: variant === "outlined" ? 2 : 0,
          borderColor,
        },
        shadowStyle,
        style,
        disabled ? { opacity: 0.5 } : { opacity: 1 },
      ]}
    >
      {icon && iconPosition === "left" && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={isFilled ? "#FFFFFF" : "#0A9D5C"}
          style={{ marginRight: 8 }}
        />
      )}

      <Text
        className={`font-semibold ${textSizeClasses[size]}`}
        style={{ color: textColor }}
      >
        {title}
      </Text>

      {icon && iconPosition === "right" && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={isFilled ? "#FFFFFF" : "#0A9D5C"}
          style={{ marginLeft: 8 }}
        />
      )}
    </Pressable>
  );
}
