import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AntCard from "@/components/molecule/AntCard";
import { useRouter } from "expo-router";

interface Props {
  readonly text: string;
  readonly isUser: boolean;
  readonly isStreaming?: boolean;
  readonly detectedSpecies?: any[];
}

export default function MessageBubble({
  text,
  isUser,
  isStreaming,
  detectedSpecies,
}: Props) {
  const router = useRouter();
  const bubbleStyle = {
    backgroundColor: isUser ? "#0A9D5C" : "#F8FAFC",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: isUser ? 0 : 20,
    borderBottomLeftRadius: isUser ? 20 : 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "80%" as `${number}%`,
    borderWidth: isUser ? 0 : 1,
    borderColor: "#E5E7EB",
  };

  return (
    <View
      style={[bubbleStyle, { alignSelf: isUser ? "flex-end" : "flex-start" }]}
    >
      {isStreaming && !text ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#0A9D5C" />
          <Text style={{ marginLeft: 8, color: "#9CA3AF" }}>Thinking...</Text>
        </View>
      ) : (
        <View>
          <Text style={{ color: isUser ? "white" : "#4B5563" }}>{text}</Text>
          {!isUser && detectedSpecies && detectedSpecies.length > 0 && (
            <View className="mt-4 gap-2">
              {detectedSpecies.map((species) => (
                <AntCard
                  key={species.id}
                  id={species.id}
                  name={species.name}
                  scientificName={species.scientific_name}
                  image={species.image}
                  variant="horizontal"
                  onPress={() =>
                    router.push({
                      pathname: "/detail/[id]",
                      params: { id: species.id },
                    })
                  }
                  riskInfo={species.risk}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
