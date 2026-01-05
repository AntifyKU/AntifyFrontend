import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  icon: any;
  active: boolean;
  onPress: () => void;
};

export default function TabItem({ label, icon, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={26} color={active ? "#16A34A" : "#90A1B9"} />
      <Text
        style={{
          fontSize: 12,
          marginTop: 4,
          color: active ? "#16A34A" : "#90A1B9",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
