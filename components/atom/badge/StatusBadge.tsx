import React from "react";
import { View, Text } from "react-native";

type Status = "pending" | "approved" | "rejected";

const STATUS_BADGE_STYLE = {
  pending: {
    borderColor: "#FFB86A",
    backgroundColor: "#FFF7ED",
    textColor: "#FF9F2F",
  },
  approved: {
    borderColor: "#00A63E",
    backgroundColor: "#F0FDF4",
    textColor: "#00A63E",
  },
  rejected: {
    borderColor: "#FF6467",
    backgroundColor: "#FEF2F2",
    textColor: "#FF6467",
  },
};

interface StatusBadgeProps {
  readonly status: Status;
  readonly label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = STATUS_BADGE_STYLE[status];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        paddingVertical: 2,
        gap: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: style.textColor,
        }}
      >
        {label ?? status.toUpperCase()}
      </Text>
    </View>
  );
}
