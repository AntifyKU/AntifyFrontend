import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}) => {
  return (
    <View className="flex-row w-full py-5 px-6 items-center justify-between bg-white">
      {/* Left Icon */}
      <View className="w-6 items-center justify-center">
        {leftIcon && onLeftPress ? (
          <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
            <Ionicons name={leftIcon} size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View className="w-6 h-6" />
        )}
      </View>

      {/* Title */}
      {title && (
        <Text className="flex-1 text-center text-gray-800 text-lg font-bold">
          {title}
        </Text>
      )}

      {/* Right Icon */}
      <View className="w-6 items-center justify-center">
        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
            <Ionicons name={rightIcon} size={24} color="#1F2937" />
          </TouchableOpacity>
        ) : (
          <View className="w-6 h-6" />
        )}
      </View>
    </View>
  );
};
