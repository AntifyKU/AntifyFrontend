import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [selectedMode, setSelectedMode] = useState('PHOTO');
  
  const cameraOptions = ['CINEMATIC', 'VIDEO', 'PHOTO', 'PORTRAIT', 'PANO'];

  return (
    <View className="flex-1 bg-black">
      {/* Camera Preview */}
      <Image 
        source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=800&width=400&query=black+ant+close+up+macro+photography" }} 
        className="flex-1 w-full h-full"
        resizeMode="cover"
      />
      
      {/* Top Controls */}
      <SafeAreaView className="absolute top-0 left-0 right-0">
        <View className="flex-row justify-between px-5 pt-2">
          <TouchableOpacity className="w-10 h-10 bg-[#333333] rounded-full items-center justify-center">
            <Ionicons name="flash" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity className="w-10 h-10 bg-[#333333] rounded-full items-center justify-center">
            <Ionicons name="chevron-up" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity className="w-10 h-10 bg-[#333333] rounded-full items-center justify-center">
            <Ionicons name="notifications-off" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Zoom Controls */}
      <View className="absolute left-0 right-0 flex-row justify-center space-x-4 bottom-32">
        <TouchableOpacity className="bg-[#333333] rounded-full px-3 py-1">
          <Text className="text-white">0.5</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#333333] rounded-full px-3 py-1">
          <Text className="text-white">1×</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Controls */}
      <View className="pt-2 pb-8 bg-black">
        {/* Camera Modes */}
        <View className="flex-row justify-between px-2 mb-4">
          {cameraOptions.map((option) => (
            <TouchableOpacity 
              key={option}
              onPress={() => setSelectedMode(option)}
              className="px-2"
            >
              <Text 
                className={`${selectedMode === option ? 'text-yellow-500 font-bold' : 'text-white'}`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Capture Button */}
        <View className="items-center">
          <TouchableOpacity 
            className="items-center justify-center w-20 h-20 border-4 border-white rounded-full"
            onPress={() => router.push('/detail')}
          >
            <View className="w-16 h-16 bg-white rounded-full" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}