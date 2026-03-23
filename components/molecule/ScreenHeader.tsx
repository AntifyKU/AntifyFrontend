import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
          <Text className="text-[#22A45D] text-base font-medium">{leftText}</Text>
        </TouchableOpacity>
      );
    }
    return <View style={{ width: 24, height: 24 }} />;
  };

  const renderRight = () => {
    if (rightActions && rightActions.length > 0) {
      return (
        <View className="flex-row items-center gap-4">
          {rightActions.map((action, index) => (
            <TouchableOpacity key={action.icon + index} onPress={action.onPress} activeOpacity={0.7}>
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
          <Text className="text-[#22A45D] text-base font-medium">{rightText}</Text>
        </TouchableOpacity>
      );
    }
    return <View style={{ width: 24, height: 24 }} />;
  };

  return (
    <View style={styles.container}>
      {/* Left และ Right อยู่ปกติ */}
      <View style={styles.side}>{renderLeft()}</View>

      {/* Title absolute เต็มความกว้างของหน้าจอ ไม่ถูก padding ของ parent กิน */}
      {title && (
        <View style={styles.titleContainer} pointerEvents="none">
          <Text style={styles.titleText} numberOfLines={0}>
            {title}
          </Text>
        </View>
      )}

      <View style={[styles.side, styles.sideRight]}>{renderRight()}</View>
    </View>
  );
};

const SIDE_WIDTH = 72;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  side: {
    width: SIDE_WIDTH,
    alignItems: "flex-start",
    zIndex: 1,
  },
  sideRight: {
    alignItems: "flex-end",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: SIDE_WIDTH,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
});