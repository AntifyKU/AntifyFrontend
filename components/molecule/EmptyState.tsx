import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonTitle?: string;
  onButtonPress?: () => void;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({
  title = "Nothing here",
  description = "",
  icon = "alert-circle-outline",
  iconSize = 64,
  iconColor = "#D1D5DB",
  containerStyle,
  titleStyle,
  descriptionStyle,
  buttonTitle,
  onButtonPress,
  buttonIcon,
}: EmptyStateProps) {
  return (
    <View className="items-center py-12" style={containerStyle}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />

      {title && (
        <Text className="mt-4 text-gray-500 text-center" style={titleStyle}>
          {title}
        </Text>
      )}

      {description && (
        <Text className="text-gray-500 text-center" style={descriptionStyle}>
          {description}
        </Text>
      )}

      {buttonTitle && onButtonPress && (
        <View className="mt-6">
          <PrimaryButton
            title={buttonTitle}
            onPress={onButtonPress}
            icon={buttonIcon}
            style={{
              shadowColor: "transparent",
              elevation: 0,
              width: undefined,
            }}
          />
        </View>
      )}
    </View>
  );
}
