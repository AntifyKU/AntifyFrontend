import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NavbarProps {
  title?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIconColor?: string;
  rightIconColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  leftIconColor = "#0F172B",
  rightIconColor = "#0F172B",
}) => {
  return (
    <View style={styles.container}>
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        {leftIcon && onLeftPress ? (
          <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
            <Ionicons name={leftIcon} size={24} color={leftIconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Title */}
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Right Icon */}
      <View style={styles.iconContainer}>
        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
            <Ionicons name={rightIcon} size={24} color={rightIconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  title: {
    flex: 1,
    color: "#0F172B",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
  },
});