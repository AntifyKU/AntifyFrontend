import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];
  
    switch (variant) {
      case "primary":
        baseStyle.push(styles.primaryButton);
        break;
      case "secondary":
        baseStyle.push(styles.secondaryButton);
        break;
      case "outline":
        baseStyle.push(styles.outlineButton);
        break;
    }
  
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }
  
    if (style) {
      baseStyle.push(style);
    }
  
    return baseStyle;
  };
  

  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.text];
  
    switch (variant) {
      case "primary":
        baseStyle.push(styles.primaryText);
        break;
      case "secondary":
        baseStyle.push(styles.secondaryText);
        break;
      case "outline":
        baseStyle.push(styles.outlineText);
        break;
    }
  
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
  
    if (textStyle) {
      baseStyle.push(textStyle);
    }
  
    return baseStyle;
  };
  

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#16A34A",
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    borderWidth: 0,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#CAD5E2",
  },
  disabledButton: {
    backgroundColor: "#E2E8F0",
    borderWidth: 0,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#1D293D",
  },
  outlineText: {
    color: "#1D293D",
  },
  disabledText: {
    color: "#94A3B8",
  },
});
