import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { SortOption } from "@/utils/sort";

interface Props {
  readonly visible: boolean;
  readonly selected: SortOption;
  readonly onClose: () => void;
  readonly onSelect: (option: SortOption) => void;
}
interface SortItemProps {
  readonly label: string;
  readonly value: SortOption;
  readonly selected: SortOption;
  readonly onSelect: (value: SortOption) => void;
}

function SortItem({ label, value, selected, onSelect }: SortItemProps) {
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
}

export default function SortModal({
  visible,
  selected,
  onClose,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
            <View className="py-4">
              <ScreenHeader title={t("sort.title")} />
            </View>

            <SortItem
              label={t("sort.nameAsc")}
              value="name-asc"
              selected={selected}
              onSelect={onSelect}
            />
            <SortItem
              label={t("sort.nameDesc")}
              value="name-desc"
              selected={selected}
              onSelect={onSelect}
            />
            <SortItem
              label={t("sort.newest")}
              value="newest"
              selected={selected}
              onSelect={onSelect}
            />
            <SortItem
              label={t("sort.oldest")}
              value="oldest"
              selected={selected}
              onSelect={onSelect}
            />

            <View className="h-4" />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
