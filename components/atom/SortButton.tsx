import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SortButtonProps {
  onPress: () => void;
  label?: string;
  showChevron?: boolean;
  isOpen?: boolean;
}

export default function SortButton({
  onPress,
  label = "Sort",
  showChevron = true,
  isOpen = false,
}: SortButtonProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-2.5 border border-gray-200 rounded-xl bg-white"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="swap-vertical" size={18} color="#333" />
      <Text className="ml-2 font-medium text-gray-700">{label}</Text>
      {showChevron && (
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#333"
          style={{ marginLeft: 6 }}
        />
      )}
    </TouchableOpacity>
  );
}
