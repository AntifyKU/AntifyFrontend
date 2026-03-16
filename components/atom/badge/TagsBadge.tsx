import React from "react";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Tags =
  | "harmful_to_humans"
  | "harmful_to_animals"
  | "harmful_to_plants"
  | "benefits_to_plants"
  | "non_toxic";

const GREEN = {
  border: "#5ECBA1",
  background: "#E6F9F2",
  icon: "#1DB87A",
  text: "#0F7A50",
};

const RED = {
  border: "#F4A0A8",
  background: "#FEF0F1",
  icon: "#E8404F",
  text: "#C0272F",
};

const TAG_CONFIG: Record<
  Tags,
  {
    colors: typeof GREEN;
    label: string;
    icon: React.ReactNode;
  }
> = {
  non_toxic: {
    colors: GREEN,
    label: "Non-toxic",
    icon: <MaterialCommunityIcons name="human" size={22} color={GREEN.icon} />,
  },
  benefits_to_plants: {
    colors: GREEN,
    label: "Benefits plants",
    icon: <MaterialCommunityIcons name="leaf" size={22} color={GREEN.icon} />,
  },
  harmful_to_humans: {
    colors: RED,
    label: "Harmful to humans",
    icon: <MaterialCommunityIcons name="human" size={22} color={RED.icon} />,
  },
  harmful_to_animals: {
    colors: RED,
    label: "Harmful to animals",
    icon: <Ionicons name="paw" size={20} color={RED.icon} />,
  },
  harmful_to_plants: {
    colors: RED,
    label: "Harmful to plants",
    icon: (
      <MaterialCommunityIcons name="flower-tulip" size={22} color={RED.icon} />
    ),
  },
};

interface TagsBadgeProps {
  readonly tags: Tags;
  readonly label?: string;
}

export default function TagsBadge({ tags, label }: TagsBadgeProps) {
  const config = TAG_CONFIG[tags];
  const { colors } = config;
  const displayLabel = label ?? config.label;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 10,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 20,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.icon}
      </View>

      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: "#1A1A1A",
          flexShrink: 1,
        }}
      >
        {displayLabel}
      </Text>
    </View>
  );
}
