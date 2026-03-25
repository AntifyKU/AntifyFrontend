import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface BadgeProps {
  readonly label: string;
  readonly isSelected?: boolean;
  readonly onPress: () => void;
  readonly icon?: string;
  readonly iconType?: "ionicons" | "material-community";
  readonly iconColor?: string;
  readonly selectedBackgroundColor?: string;
  readonly unselectedBackgroundColor?: string;
  readonly showCloseIcon?: boolean;
  readonly size?: "small" | "medium" | "large";
}

export default function Badge({
  label,
  isSelected = false,
  onPress,
  icon,
  iconType = "material-community",
  iconColor,
  selectedBackgroundColor = "#22A45D",
  unselectedBackgroundColor = "#e8f5e0",
  showCloseIcon = true,
  size = "medium",
}: BadgeProps) {
  const sizeClasses = {
    small: "px-4 py-2",
    medium: "px-5 py-2.5",
    large: "px-6 py-3",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  let iconSize: number;
  if (size === "small") {
    iconSize = 12;
  } else if (size === "medium") {
    iconSize = 16;
  } else {
    iconSize = 20;
  }

  const backgroundColor = isSelected
    ? selectedBackgroundColor
    : unselectedBackgroundColor;
  const textColor = isSelected ? "#FFFFFF" : "#22A45D";
  const currentIconColor = isSelected ? "#FFFFFF" : iconColor || "#22A45D";

  const renderIcon = () => {
    if (!icon) return null;

    if (iconType === "ionicons") {
      return (
        <Ionicons
          name={icon as any}
          size={iconSize}
          color={currentIconColor}
          style={{ marginRight: 6 }}
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={icon as any}
        size={iconSize}
        color={currentIconColor}
        style={{ marginRight: 6 }}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-full mr-2 mb-2 ${sizeClasses[size]}`}
      style={{ backgroundColor, minHeight: icon ? 32 : 28 }}
      activeOpacity={1}
    >
      {renderIcon()}
      <Text
        className={`font-medium ${textSizeClasses[size]}`}
        style={{ color: textColor }}
      >
        {label}
      </Text>

      {isSelected && showCloseIcon && (
        <Ionicons
          name="close"
          size={iconSize}
          color="#FFFFFF"
          style={{ marginLeft: 6 }}
        />
      )}
    </TouchableOpacity>
  );
}