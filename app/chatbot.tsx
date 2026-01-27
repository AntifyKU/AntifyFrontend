import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useChatbot } from "@/hooks/useChatbot";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import MessageBubble from "@/components/atom/MessageBubble";

export default function ChatbotScreen() {
  const { messages, isConnected, isTyping, sendMessage, sendMessageWithImage } =
    useChatbot(
      "Ask me about ants! I can help identify species and answer questions.",
    );

  const [inputText, setInputText] = React.useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const startAnimation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startAnimation();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const asset = result.assets[0];
      const message =
        inputText.trim() || "What can you tell me about this image?";

      sendMessageWithImage(
        message,
        asset.base64!,
        asset.mimeType || "image/jpeg",
      );
      setInputText("");
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
      <View style={{ paddingTop: 24, paddingBottom: 16 }}>
        <ScreenHeader title="Live Chat" />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#E5E7EB",
            }}
          >
            <Animated.View
              style={{
                width: 90,
                height: 90,
                transform: [{ rotate }],
              }}
            >
              <LinearGradient
                colors={["#BEF264", "#22D3EE", "#8B5CF6", "#BEF264"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </Animated.View>

            <View
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("@/assets/images/chat-logo.png")}
                style={{ width: 44, height: 44, borderRadius: 22 }}
              />
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: isConnected ? "#22C55E" : "#EF4444",
              borderWidth: 2,
              borderColor: "white",
              zIndex: 20,
            }}
          />
        </View>

        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Antify</Text>
          <Text style={{ color: "#9CA3AF" }}>
            {isConnected ? "Support Agent" : "Connecting..."}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, index) => (
            <View key={msg.id} style={{ marginBottom: 12 }}>
              {!msg.isUser && index === 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#F3F4F6",
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={16}
                      color="#666"
                    />
                  </View>
                  <Text style={{ color: "#6B7280" }}>
                    Livechat {formatTime(msg.timestamp)}
                  </Text>
                </View>
              )}

              <MessageBubble
                text={msg.text}
                isUser={msg.isUser}
                isStreaming={msg.isStreaming}
              />

              {msg.isUser && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    alignSelf: "flex-end",
                    marginTop: 4,
                  }}
                >
                  {formatTime(msg.timestamp)}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 12,
            borderTopWidth: 1,
            borderColor: "#F3F4F6",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity onPress={handleImagePick}>
            <Ionicons name="add" size={30} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 999,
              fontSize: 16,
              backgroundColor: "#FFFFFF",
            }}
            placeholder="Write a message"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!isConnected || isTyping}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isConnected ? "#0A9D5C" : "#D1D5DB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isTyping ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="send" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
