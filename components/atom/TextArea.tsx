import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";

interface CustomTextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  minHeight?: number;
}

export default function TextArea({
  label,
  error,
  containerStyle,
  style,
  minHeight = 120,
  ...props
}: Readonly<CustomTextAreaProps>) {
  const [isFocused, setIsFocused] = useState(false);

  let borderColor = "#E5E7EB";
  if (error) {
    borderColor = "#EF4444";
  } else if (isFocused) {
    borderColor = "#0A9D5C";
  }

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { borderColor, minHeight },
          isFocused && styles.focusedContainer,
        ]}
      >
        <RNTextInput
          {...props}
          multiline
          textAlignVertical="top"
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  focusedContainer: {
    backgroundColor: "#FFFFFF",
  },
  input: {
    fontSize: 16,
    color: "#1F2937",
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});
