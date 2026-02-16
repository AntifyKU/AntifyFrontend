import React from "react";
import { Pressable, Text, ViewStyle, TextStyle } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

type IconType = "ion" | "ant";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  iconType?: IconType;
  iconPosition?: "left" | "right";
  variant?: "filled" | "outlined";
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  icon,
  iconType = "ion",
  iconPosition = "left",
  variant = "filled",
  disabled = false,
  fullWidth = true,
  size = "medium",
  style,
  textStyle,
  iconColor,
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

  const renderIcon = (marginStyle: object) => {
    if (!icon) return null;

    if (iconType === "ant") {
      return (
        <AntDesign
          name={icon as any}
          size={iconSize}
          color={iconColor || textColor}
          style={marginStyle}
        />
      );
    }

    return (
      <Ionicons
        name={icon as any}
        size={iconSize}
        color={iconColor || textColor}
        style={marginStyle}
      />
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-full ${sizeClasses[size]} ${
        fullWidth ? "w-full" : "self-start"
      }`}
      style={[
        {
          backgroundColor,
          borderWidth: variant === "outlined" ? 2 : 0,
          borderColor,
        },
        shadowStyle,
        style,
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      {icon && iconPosition === "left" && renderIcon({ marginRight: 8 })}
      <Text
        className={`font-semibold ${textSizeClasses[size]}`}
        style={[{ color: textColor }, textStyle]}
      >
        {title}
      </Text>
      {icon && iconPosition === "right" && renderIcon({ marginLeft: 8 })}
    </Pressable>
  );
}
