import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface RequestBadgeProps {
  readonly label: string;
  readonly isSelected?: boolean;
  readonly onPress: () => void;
  readonly count?: number;
}

export default function RequestBadge({
  label,
  isSelected = false,
  onPress,
  count,
}: RequestBadgeProps) {
  const bg = isSelected ? "#00A63E" : "#F1F5F9";
  const textColor = isSelected ? "#FFFFFF" : "#94A3B8"; // slate-400

  const circleBg = isSelected ? "rgba(255,255,255,0.5)" : "#FFFFFF";
  const circleText = isSelected ? "#FFFFFF" : "#94A3B8";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 24,
        backgroundColor: bg,
        marginRight: 8,
      }}
    >
      <Text style={{ color: textColor, fontWeight: "500" }}>{label}</Text>

      {typeof count === "number" && (
        <View
          style={{
            marginLeft: 8,
            minWidth: 24,
            height: 24,
            borderRadius: 20,
            backgroundColor: circleBg,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 6,
          }}
        >
          <Text style={{ fontSize: 12, color: circleText, fontWeight: "600" }}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
