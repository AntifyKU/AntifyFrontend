import React from "react";
import { View, Text, ScrollView, StatusBar, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Badge from "@/components/atom/Badge";
import { filterOptions, quickDiscoveryCategories } from "@/constants/AntData";
import PrimaryButton from "@/components/atom/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import FilterSection from "@/components/molecule/FilterSection";

export type FilterState = {
  quickFilters: string[];
  colors: string[];
  sizes: string[];
  habitats: string[];
  distributions: string[];
};

type Props = {
  visible: boolean;
  tempFilters: FilterState;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggle: (category: keyof FilterState, value: string) => void;
};

export default function FilterModal({
  visible,
  tempFilters,
  onClose,
  onApply,
  onClear,
  onToggle,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
        {/* Header */}
        <View className="py-6 border-b border-gray-200">
          <ScreenHeader
            title="Filter"
            leftText="Cancel"
            onLeftPress={onClose}
            rightText="Clear All"
            onRightPress={onClear}
          />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Filter */}
          <View className="mt-6 mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Quick Filter
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {quickDiscoveryCategories.map((filter) => (
                  <Badge
                    key={filter.id}
                    label={filter.name}
                    icon={filter.icon}
                    iconColor={filter.color}
                    isSelected={tempFilters.quickFilters.includes(filter.id)}
                    onPress={() => onToggle("quickFilters", filter.id)}
                    selectedBackgroundColor="#F59E0B"
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Color */}
          <FilterSection
            title="Color"
            options={filterOptions.colors}
            selected={tempFilters.colors}
            onToggle={(v) => onToggle("colors", v)}
          />

          {/* Habitat */}
          <FilterSection
            title="Habitat"
            options={filterOptions.habitats}
            selected={tempFilters.habitats}
            onToggle={(v) => onToggle("habitats", v)}
          />

          {/* Distribution */}
          <FilterSection
            title="Distribution"
            options={filterOptions.distributions}
            selected={tempFilters.distributions}
            onToggle={(v) => onToggle("distributions", v)}
          />
        </ScrollView>

        <View className="px-6 pt-4">
          <PrimaryButton title="Apply Filters" onPress={onApply} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
