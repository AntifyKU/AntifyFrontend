import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type FAQItem = {
  id: string;
  question: string;
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ask me or browse the frequently asked question below for inspiration.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  
  const faqItems: FAQItem[] = [
    { id: '1', question: 'Does Black Carpenter ant cause allergies or irritations?' },
    { id: '2', question: 'How to handles with Black Carpenter ant?' },
    { id: '3', question: 'What is the size of Black Carpenter ant?' },
  ];
  
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for your question about "${text}". Our ant experts are analyzing this information and will provide a detailed response shortly.`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const handleFAQPress = (question: string) => {
    sendMessage(question);
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
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
          </View>
          <View>
            <Text className="text-xl font-medium text-gray-700">Antify</Text>
            <Text className="text-gray-400">Support Agent</Text>
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
      
      {/* Chat Messages */}
      <ScrollView className="flex-1 px-4 pt-2">
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
              <Text className="text-base text-gray-600">{message.text}</Text>
            </View>
            
            {message.isUser && (
              <Text className="mt-1 text-right text-gray-500">
                Visitor {formatTime(message.timestamp)}
              </Text>
            )}
          </View>
        ))}
        
        {/* FAQ Buttons */}
        {messages.length === 1 && (
          <View className="mt-4">
            {faqItems.map(item => (
              <TouchableOpacity 
                key={item.id}
                className="px-4 py-3 mb-3 border border-gray-200 rounded-full"
                onPress={() => handleFAQPress(item.question)}
              >
                <Text className="text-gray-600">{item.question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-row items-center px-4 py-2 border-t border-gray-200">
          <TextInput
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-full"
            placeholder="Write a message"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage(inputText)}
          />
          <TouchableOpacity className="ml-2">
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="ml-2 w-10 h-10 bg-[#0A9D5C] rounded-full items-center justify-center"
            onPress={() => sendMessage(inputText)}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}