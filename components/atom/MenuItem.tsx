import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  onPress: () => void;
  iconColor?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  description,
  onPress,
  iconColor = "#666",
}) => (
  <TouchableOpacity
    className="flex-row items-center py-4 border-b border-gray-100"
    onPress={onPress}
  >
    <View
      className="w-10 h-10 rounded-full items-center justify-center mr-3"
      style={{ backgroundColor: "transparent" }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        {title}
      </Text>
      {description && (
        <Text className="text-base text-gray-500 leading-5">{description}</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);
