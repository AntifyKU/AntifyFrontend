import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RequestTypeCardProps {
  type: "update" | "new";
  selected: boolean;
  onPress: () => void;
}

export default function RequestTypeCard({
  type,
  selected,
  onPress,
}: RequestTypeCardProps) {
  const isUpdate = type === "update";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        backgroundColor: selected ? "#ECFDF5" : "#FFFFFF",
        borderColor: selected ? "#22A45D" : "#E5E7EB",
      }}
    >
      <View style={{ marginTop: 2, marginRight: 12 }}>
        <Ionicons
          name={selected ? "radio-button-on" : "radio-button-off"}
          size={24}
          color={selected ? "#22A45D" : "#D1D5DB"}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          {isUpdate ? "Update Information" : "Add New Species"}
        </Text>
        <Text style={{ fontSize: 13, color: "#6B7280" }}>
          {isUpdate
            ? "Report new sighting or behavior or fix incorrect information"
            : "Submit a new species to the system"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
