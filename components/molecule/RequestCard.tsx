import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "@/components/atom/badge/StatusBadge";

type Role = "user" | "admin";
type Status = "pending" | "approved" | "rejected";

interface Props {
  title: string;
  action: string;
  status: Status;
  date: string;
  by?: string;
  role: Role;
  onPress?: () => void;
}

function getActionStyle(action: string) {
  switch (action) {
    case "Update Info":
      return { color: "#155DFC", iconName: "create-outline" as const };
    case "Add Species":
      return { color: "#00A63E", iconName: "add-circle-outline" as const };
    default:
      return { color: "#6B7280", iconName: "ellipse-outline" as const };
  }
}

export default function RequestCard({
  title,
  action,
  status,
  date,
  by,
  role,
  onPress,
}: Props) {
  const { color, iconName } = getActionStyle(action);

  return (
    <Pressable
      onPress={onPress}
      className="mb-5 rounded-2xl"
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <View className="p-4 border border-gray-300 rounded-2xl bg-white">
        <View className="flex-row items-start justify-between">
          <Text className="font-semibold text-lg flex-1 mr-2">{title}</Text>
          <StatusBadge status={status} />
        </View>

        {role === "admin" && by && (
          <Text className="text-base text-gray-400 mt-2">By {by}</Text>
        )}

        <View className="flex-row items-center gap-1 mt-2">
          <Ionicons name={iconName} size={14} color={color} />
          <Text className="text-base ml-2" style={{ color }}>
            {action}
          </Text>
        </View>

        <Text className="text-sm text-gray-500 mt-2">
          {role === "admin" ? `Last Updated: ${date}` : `Submitted ${date}`}
        </Text>
      </View>
    </Pressable>
  );
}
