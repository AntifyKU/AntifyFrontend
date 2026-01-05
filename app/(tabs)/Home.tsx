import React from 'react';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-[#e6f0d8]">
      <Text className="mb-4 text-2xl font-bold text-black">Home</Text>
      <Text className="text-black">Welcome to the home screen</Text>
    </View>
  );
}