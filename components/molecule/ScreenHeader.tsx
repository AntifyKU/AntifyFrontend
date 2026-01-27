import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftText?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  leftText,
  rightIcon,
  rightText,
  onLeftPress,
  onRightPress,
}) => {
  const renderLeft = () => {
    if (leftIcon && onLeftPress) {
      return (
        <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
          <Ionicons name={leftIcon} size={24} color="#333" />
        </TouchableOpacity>
      );
    }

    if (leftText && onLeftPress) {
      return (
        <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
          <Text className="text-[#22A45D] text-base font-medium">
            {leftText}
          </Text>
        </TouchableOpacity>
      );
    }

    return <View className="w-6 h-6" />;
  };

  const renderRight = () => {
    if (rightIcon && onRightPress) {
      return (
        <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
          <Ionicons name={rightIcon} size={24} color="#333" />
        </TouchableOpacity>
      );
    }

    if (rightText && onRightPress) {
      return (
        <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
          <Text className="text-[#22A45D] text-base font-medium">
            {rightText}
          </Text>
        </TouchableOpacity>
      );
    }

    return <View className="w-6 h-6" />;
  };

  return (
    <View className="flex-row w-full py-5 px-6 items-center justify-between bg-white relative">
      <View className="z-10 min-w-[60px] items-start">{renderLeft()}</View>

      {title && (
        <View
          className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center"
          pointerEvents="none"
        >
          <Text className="text-gray-800 text-xl font-bold">{title}</Text>
        </View>
      )}

      <View className="z-10 min-w-[60px] items-end">{renderRight()}</View>
    </View>
  );
};
