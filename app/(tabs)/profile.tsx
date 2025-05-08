import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#e6f0d8]">
      <Text className="mb-4 text-2xl font-bold text-black">Profile</Text>
      <Text className="text-black">Your profile information</Text>
    </View>
  );
}