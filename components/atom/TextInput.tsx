import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export default function TextInput({
  label,
  icon,
  error,
  containerStyle,
  isPassword = false,
  style,
  ...props
}: Readonly<CustomTextInputProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let borderColor = "#E5E7EB";
  if (error) {
    borderColor = "#EF4444";
  } else if (isFocused) {
    borderColor = "#0A9D5C";
  }

  const passwordProps: Partial<TextInputProps> = isPassword
    ? {
        autoComplete: "off",
        autoCorrect: false,
        autoCapitalize: "none",
        textContentType: "oneTimeCode", // Prevents iOS password autofill UI
        passwordRules: "", // Disables iOS password suggestions
        importantForAutofill: "no", // Android: disables autofill
      }
    : {};

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor },
          isFocused && styles.focusedContainer,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? "#0A9D5C" : "#9CA3AF"}
            style={styles.icon}
          />
        )}
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...passwordProps}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={1}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  focusedContainer: {
    backgroundColor: "#FFFFFF",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});
