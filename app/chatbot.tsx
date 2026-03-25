import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  Animated,
  Easing,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useChatbot } from "@/hooks/useChatbot";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import MessageBubble from "@/components/atom/MessageBubble";
import { useLocalSearchParams } from "expo-router";

export default function ChatbotScreen() {
  const params = useLocalSearchParams<{ initialAntName?: string }>();
  const { t } = useTranslation();

  const initialMessage = params.initialAntName
    ? t("chatbot.askAboutAnt", { antName: params.initialAntName })
    : t("chatbot.askAboutAnts");

  const initialContext = params.initialAntName
    ? `User viewing ${params.initialAntName}`
    : undefined;

  const { messages, isConnected, isTyping, sendMessage } =
    useChatbot(initialMessage, initialContext);

  const [inputText, setInputText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // auto scroll
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // keyboard fix
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // rotate animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* HEADER */}
      <View style={{ paddingTop: 24, paddingBottom: 16 }}>
        <ScreenHeader title={t("tabs.chatbot")} />
      </View>

      {/* AGENT HEADER */}
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
        {/* ✅ FIXED AVATAR */}
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

          {/* ONLINE DOT */}
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
            }}
          />
        </View>

        {/* TEXT */}
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Antify</Text>
          <Text style={{ color: "#9CA3AF" }}>
            {isConnected ? "Support Agent" : "Connecting..."}
          </Text>
        </View>
      </View>

      {/* CHAT */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => (
          <View key={msg.id} style={{ marginBottom: 12 }}>
            {!msg.isUser && index === 0 && (
              <Text style={{ color: "#6B7280", marginBottom: 8 }}>
                Live Chat {formatTime(msg.timestamp)}
              </Text>
            )}

            <MessageBubble
              text={msg.text}
              isUser={msg.isUser}
              isStreaming={msg.isStreaming}
              detectedSpecies={msg.detectedSpecies}
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

      {/* INPUT */}
      <View
        style={{
          position: "absolute",
          bottom: keyboardHeight,
          left: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          gap: 12,
          borderTopWidth: 1,
          borderColor: "#F3F4F6",
          backgroundColor: "white",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 999,
          }}
          placeholder={t("chatbot.inputPlaceholder")}
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
    </SafeAreaView>
  );
}
