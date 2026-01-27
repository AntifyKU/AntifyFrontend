import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";

interface Props {
  visible: boolean;
  selected: SortOption;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
}

export default function SortModal({
  visible,
  selected,
  onClose,
  onSelect,
}: Props) {
  const renderItem = (label: string, value: SortOption) => {
    const active = selected === value;
    return (
      <TouchableOpacity
        className={`flex-row items-center justify-between px-6 py-4 border-b border-gray-100 ${active ? "bg-green-50" : ""}`}
        onPress={() => onSelect(value)}
      >
        <Text
          className={`text-base ${active ? "text-[#22A45D] font-semibold" : "text-gray-700"}`}
        >
          {label}
        </Text>
        {active && <Ionicons name="checkmark" size={24} color="#22A45D" />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
            <View className="py-4">
              <ScreenHeader title="Sort By" />
            </View>

            {renderItem("Name (A-Z)", "name-asc")}
            {renderItem("Name (Z-A)", "name-desc")}
            {renderItem("Newest First", "newest")}
            {renderItem("Oldest First", "oldest")}

            <View className="h-4" />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
