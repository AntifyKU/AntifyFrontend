import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define the type for route params
type DetailParams = {
  imageUri?: string;
};

export default function DetailScreen() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const params = useLocalSearchParams<DetailParams>();
  const imageUri = params.imageUri;
  
  return (
    <SafeAreaView className="flex-1 bg-[#f5f7e8]">
      {/* Header */}
      <View className="px-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {/* Image Display */}
        <View className="items-center justify-center py-8">
          {imageUri ? (
            <Image 
              source={{ uri: imageUri }} 
              className="rounded-lg w-60 h-60"
              resizeMode="cover"
            />
          ) : (
            <Image 
              source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=150&width=150&query=image+icon" }}
              className="w-20 h-20"
            />
          )}
        </View>
        
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <View 
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${index === activeSlide ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          ))}
        </View>
        
        {/* Content */}
        <View className="px-5">
          <Text className="mb-1 text-2xl font-bold text-black">Worem ipsum</Text>
          
          <View className="mb-4">
            <Text className="text-gray-600">Scientific name:</Text>
            <Text className="text-gray-600">Genus:</Text>
          </View>
          
          <View className="mb-4">
            <View className="bg-[#0A9D5C] self-start rounded-full px-4 py-1">
              <Text className="text-xs text-white uppercase">Convenient</Text>
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="mb-1 text-lg font-bold text-black">Habitat</Text>
            <Text className="text-gray-600">
              Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </Text>
          </View>
          
          <View className="mb-8">
            <Text className="mb-1 text-lg font-bold text-black">Behavior</Text>
            <Text className="text-gray-600">
              Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu
            </Text>
          </View>
          
          {/* Buttons */}
          <View className="flex-row mb-8">
            {/* Add to Collection Button */}
            <TouchableOpacity className="bg-[#0A9D5C] rounded-lg py-4 flex-1 items-center mr-2">
              <View className="flex-row items-center">
                <Ionicons name="add" size={20} color="#fff" />
                <Text className="ml-2 font-medium text-white">Add to Collection</Text>
              </View>
            </TouchableOpacity>
            
            {/* Chat Button */}
            <TouchableOpacity 
              className="bg-[#0A9D5C] rounded-lg py-4 flex-1 items-center ml-2"
              onPress={() => router.push('/chatbot')}
            >
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                <Text className="ml-2 font-medium text-white">Chat with us</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Chat Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#0A9D5C] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/chatbot')}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}