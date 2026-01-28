import React from "react";
import { View, Text } from "react-native";
import Badge from "@/components/atom/Badge";

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: Props) {
  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-gray-800">
        {title}
      </Text>

      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <Badge
            key={option}
            label={option}
            isSelected={selected.includes(option)}
            onPress={() => onToggle(option)}
          />
        ))}
      </View>
    </View>
  );
}
