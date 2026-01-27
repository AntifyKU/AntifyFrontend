import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerClassName?: string;
  showBorder?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  containerClassName = "px-5 mb-4",
  showBorder = true,
}: SearchBarProps) {
  return (
    <View className={containerClassName}>
      <View
        className={`flex-row items-center px-4 py-3 bg-gray-50 rounded-full ${showBorder ? "border border-gray-200" : ""}`}
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-700"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
}
