import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface Props {
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export default function MessageBubble({ text, isUser, isStreaming }: Props) {
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
        <Text style={{ color: isUser ? "white" : "#4B5563" }}>{text}</Text>
      )}
    </View>
  );
}
