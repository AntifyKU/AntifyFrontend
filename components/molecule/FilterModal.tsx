import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterChip from "@/components/FilterChip";
import { filterOptions, quickDiscoveryCategories } from "@/constants/AntData";
import PrimaryButton from "@/components/atom/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

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
          className="flex-1 px-5"
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
                  <FilterChip
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
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Color
            </Text>
            <View className="flex-row flex-wrap">
              {filterOptions.colors.map((color) => (
                <FilterChip
                  key={color}
                  label={color}
                  isSelected={tempFilters.colors.includes(color)}
                  onPress={() => onToggle("colors", color)}
                />
              ))}
            </View>
          </View>

          {/* Habitat */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Habitat
            </Text>
            <View className="flex-row flex-wrap">
              {filterOptions.habitats.map((habitat) => (
                <FilterChip
                  key={habitat}
                  label={habitat}
                  isSelected={tempFilters.habitats.includes(habitat)}
                  onPress={() => onToggle("habitats", habitat)}
                />
              ))}
            </View>
          </View>

          {/* Distribution */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Distribution
            </Text>
            <View className="flex-row flex-wrap">
              {filterOptions.distributions.map((dist) => (
                <FilterChip
                  key={dist}
                  label={dist}
                  isSelected={tempFilters.distributions.includes(dist)}
                  onPress={() => onToggle("distributions", dist)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pt-4">
          <PrimaryButton
            title="Apply Filters"
            onPress={onApply}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
