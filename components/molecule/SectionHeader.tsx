import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

interface SectionHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly showSeeMore?: boolean;
  readonly onSeeMorePress?: () => void;
  readonly seeMoreText?: string;
  readonly containerClassName?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  showSeeMore = false,
  onSeeMorePress,
  seeMoreText,
  containerClassName = "px-5 mb-3",
}: SectionHeaderProps) {
  const { t } = useTranslation();
  const finalSeeMoreText = seeMoreText ?? t("home.see_more");
  return (
    <View
      className={`flex-row items-center justify-between ${containerClassName}`}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-base">{subtitle}</Text>
        )}
      </View>
      {showSeeMore && onSeeMorePress && (
        <TouchableOpacity onPress={onSeeMorePress}>
          <Text className="text-[#328e6e] font-medium">{finalSeeMoreText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
