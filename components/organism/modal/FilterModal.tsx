import React from "react";
import { View, Text, ScrollView, StatusBar, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Badge from "@/components/atom/badge/Badge";
import { filterOptions, quickDiscoveryCategories } from "@/constants/Filters";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import FilterSection from "@/components/molecule/FilterSection";

export type FilterState = {
  quickFilters: string[];
  colors: string[];
  habitats: string[];
  risks: string[];
  distributions: string[];
};

type Props = {
  readonly visible: boolean;
  readonly tempFilters: FilterState;
  readonly onClose: () => void;
  readonly onApply: () => void;
  readonly onClear: () => void;
  readonly onToggle: (category: keyof FilterState, value: string) => void;
};

export default function FilterModal({
  visible,
  tempFilters,
  onClose,
  onApply,
  onClear,
  onToggle,
}: Props) {
  const { t } = useTranslation();

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
            title={t("filter.title")}
            leftText={t("common.cancel")}
            onLeftPress={onClose}
            rightText={t("common.clearAll")}
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
              {t("filter.quickfilter")}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {quickDiscoveryCategories.map((filter) => (
                  <Badge
                    key={filter.id}
                    label={t(`badge.${filter.tag}`)}
                    icon={filter.icon}
                    iconColor={filter.color}
                    isSelected={tempFilters.quickFilters.includes(filter.id)}
                    onPress={() => onToggle("quickFilters", filter.id)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Risk */}
          <FilterSection
            title={t("filter.risk")}
            options={filterOptions.risks}
            selected={tempFilters.risks}
            onToggle={(v) => onToggle("risks", v)}
          />

          {/* Color */}
          <FilterSection
            title={t("filter.color")}
            options={filterOptions.colors}
            selected={tempFilters.colors}
            onToggle={(v) => onToggle("colors", v)}
          />

          {/* Habitat */}
          <FilterSection
            title={t("filter.habitat")}
            options={filterOptions.habitats}
            selected={tempFilters.habitats}
            onToggle={(v) => onToggle("habitats", v)}
          />

          {/* Distribution */}
          <FilterSection
            title={t("filter.distribution")}
            options={filterOptions.distributions}
            selected={tempFilters.distributions}
            onToggle={(v) => onToggle("distributions", v)}
          />
        </ScrollView>

        <View className="px-6 pt-4">
          <PrimaryButton title={t("filter.applyFilters")} onPress={onApply} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
