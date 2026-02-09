import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  onPress?: () => void;
  iconColor?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  description,
  onPress,
  iconColor = "#666",
  switchValue,
  onSwitchChange,
  disabled = false,
}) => {
  const hasSwitch = typeof switchValue === "boolean";

  return (
    <TouchableOpacity
      className="flex-row items-center py-4 border-b border-gray-100"
      onPress={hasSwitch ? undefined : onPress}
      activeOpacity={hasSwitch ? 1 : 0.7}
      disabled={disabled}
    >
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </Text>
        {description && (
          <Text className="text-base text-gray-500 leading-5">
            {description}
          </Text>
        )}
      </View>

      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
          thumbColor={switchValue ? "#22A45D" : "#F3F4F6"}
          ios_backgroundColor="#D1D5DB"
          disabled={disabled}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
};
