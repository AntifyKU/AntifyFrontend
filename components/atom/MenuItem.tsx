import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MenuItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  leftSlot?: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  iconColor?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
  showChevron?: boolean;
  // custom text size
  titleSize?: number;
  descriptionSize?: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  leftSlot,
  title,
  description,
  onPress,
  iconColor = "#666",
  switchValue,
  onSwitchChange,
  disabled = false,
  showChevron = true,
  titleSize,
  descriptionSize,
}) => {
  const hasSwitch = typeof switchValue === "boolean";

  let rightElement = null;
  if (hasSwitch) {
    rightElement = (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
        thumbColor={switchValue ? "#22A45D" : "#F3F4F6"}
        ios_backgroundColor="#D1D5DB"
        disabled={disabled}
      />
    );
  } else if (showChevron) {
    rightElement = (
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    );
  }

  return (
    <TouchableOpacity
      className="flex-row items-center py-4 border-b border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View className="mr-3">
        {leftSlot}
        {!leftSlot && icon && (
          <View className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          className="font-semibold text-gray-800 mb-2"
          style={{ fontSize: titleSize ?? 16 }}
        >
          {title}
        </Text>
        {description && (
          <Text
            className="text-base text-gray-500 leading-5"
            style={{ fontSize: descriptionSize ?? 14 }}
          >
            {description}
          </Text>
        )}
      </View>

      {rightElement}
    </TouchableOpacity>
  );
};
