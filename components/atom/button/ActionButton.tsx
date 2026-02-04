import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ActionType = "sort" | "filter";

interface ActionButtonProps {
  type: ActionType;
  label: string;
  onPress: () => void;
  isOpen?: boolean;
  badgeCount?: number;
}

const ACTION_CONFIG = {
  sort: {
    icon: "swap-vertical",
  },
  filter: {
    icon: "options-outline",
  },
} as const;

export default function ActionButton({
  type,
  label,
  onPress,
  isOpen,
  badgeCount = 0,
}: ActionButtonProps) {
  const config = ACTION_CONFIG[type];

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center px-4 border border-gray-200 rounded-xl bg-white"
      style={{ minHeight: 40 }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={config.icon as any} size={18} color="#333" />
      <Text className="ml-2 font-medium text-gray-700">{label}</Text>

      {type === "sort" && (
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#333"
          style={{ marginLeft: 6 }}
        />
      )}

      {type === "filter" && badgeCount > 0 && (
        <View className="ml-2 bg-[#22A45D] rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-xs font-bold text-white">{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
