import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

export interface RightAction {
  icon: IconName;
  onPress: () => void;
}

interface HeaderProps {
  title?: string;
  leftIcon?: IconName;
  leftText?: string;
  onLeftPress?: () => void;
  rightActions?: RightAction[];
  rightIcon?: IconName;
  rightText?: string;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  leftText,
  onLeftPress,
  rightActions,
  rightIcon,
  rightText,
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
    if (rightActions && rightActions.length > 0) {
      return (
        <View className="flex-row items-center gap-4">
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={action.icon + index}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={action.icon} size={24} color="#333" />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

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
