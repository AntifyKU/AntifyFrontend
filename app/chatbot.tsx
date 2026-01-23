import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useChatbot, ChatMessage } from '@/hooks/useChatbot';

export default function ChatbotScreen() {
  const {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    sendMessageWithImage,
  } = useChatbot('Ask me about ants! I can help identify species and answer questions.');

  const [inputText, setInputText] = React.useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const asset = result.assets[0];
      const base64 = asset.base64!; // TypeScript now knows this is string (checked on line 54)
      const mimeType = asset.mimeType || 'image/jpeg';

      // Prompt user for message about the image
      const message = inputText.trim() || 'What can you tell me about this image?';
      sendMessageWithImage(message, base64, mimeType);
      setInputText('');
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-xl font-medium text-gray-500">Chat with us!</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <Ionicons name="remove" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Agent Info */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-12 h-12 mr-3 bg-white border-2 border-gray-200 rounded-full">
            <View className="w-8 h-8 bg-[#0A9D5C] rounded-md items-center justify-center">
              <Ionicons name="chatbubble-ellipses" size={16} color="white" />
            </View>
            <View className={`absolute bottom-0 right-0 w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'} border border-white rounded-full`} />
          </View>
          <View>
            <Text className="text-xl font-medium text-gray-700">Antify</Text>
            <Text className="text-gray-400">
              {isConnected ? 'Support Agent' : 'Connecting...'}
            </Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <Ionicons name="thumbs-up-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="thumbs-down-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 pt-2"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View key={message.id} className="mb-4">
              {!message.isUser && index === 0 && (
                <View className="flex-row items-center mb-2">
                  <View className="items-center justify-center w-8 h-8 mr-2 bg-gray-100 rounded-full">
                    <Ionicons name="chatbubble-ellipses" size={16} color="#666" />
                  </View>
                  <Text className="text-gray-500">Livechat {formatTime(message.timestamp)}</Text>
                </View>
              )}

              <View className={`${message.isUser ? 'ml-auto bg-gray-100' : 'mr-auto bg-white border border-gray-200'} rounded-2xl px-4 py-3 max-w-[80%]`}>
                {message.isStreaming && !message.text ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#0A9D5C" />
                    <Text className="ml-2 text-gray-400">Thinking...</Text>
                  </View>
                ) : (
                  <Text className="text-base text-gray-600">{message.text}</Text>
                )}
              </View>

              {message.isUser && (
                <Text className="mt-1 text-right text-gray-500">
                  Visitor {formatTime(message.timestamp)}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View className="flex-row items-center px-4 py-2 border-t border-gray-200">
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 9999,
              fontSize: 16,
              color: '#4b5563',
              backgroundColor: '#fff',
            }}
            placeholder="Write a message"
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            autoCapitalize="none"
            autoCorrect={true}
          />
          <TouchableOpacity className="ml-2">
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2" onPress={handleImagePick}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            className={`ml-2 w-10 h-10 ${isConnected ? 'bg-[#0A9D5C]' : 'bg-gray-300'} rounded-full items-center justify-center`}
            onPress={handleSend}
            disabled={!isConnected || isTyping}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}