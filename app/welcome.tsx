import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 px-6">
        {/* Top Section - Logo & Illustration */}
        <View className="flex-1 items-center justify-center">
          {/* Decorative circles */}
          <View className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#0A9D5C]/10" />
          <View className="absolute top-32 right-8 w-12 h-12 rounded-full bg-[#c5e063]/30" />
          <View className="absolute bottom-20 left-6 w-16 h-16 rounded-full bg-[#0A9D5C]/5" />

          {/* Main Logo */}
          <View className="w-32 h-32 rounded-full bg-[#0A9D5C] items-center justify-center mb-6">
            <Ionicons name="bug" size={64} color="#FFFFFF" />
          </View>

          {/* App Name */}
          <Text className="text-4xl font-bold text-gray-800 mb-2">Antify</Text>
          <Text className="text-lg text-gray-500 text-center mb-4">
            Discover Thailand's Amazing Ants
          </Text>

          {/* Feature highlights */}
          <View className="mt-8 w-full">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-[#0A9D5C]/10 items-center justify-center">
                <Ionicons name="camera" size={20} color="#0A9D5C" />
              </View>
              <Text className="ml-4 text-gray-600 flex-1">Identify ant species with AI</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-[#0A9D5C]/10 items-center justify-center">
                <Ionicons name="library" size={20} color="#0A9D5C" />
              </View>
              <Text className="ml-4 text-gray-600 flex-1">Explore 15+ Thai ant species</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-[#0A9D5C]/10 items-center justify-center">
                <Ionicons name="albums" size={20} color="#0A9D5C" />
              </View>
              <Text className="ml-4 text-gray-600 flex-1">Build your personal collection</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View className="pb-8">
          {/* Sign In Button */}
          <TouchableOpacity
            className="bg-[#0A9D5C] rounded-full py-4 mb-4"
            style={{
              shadowColor: '#0A9D5C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">Sign In</Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            className="border-2 border-[#0A9D5C] rounded-full py-4 mb-6"
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.8}
          >
            <Text className="text-[#0A9D5C] font-semibold text-lg text-center">Create Account</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-gray-400 text-center text-xs">
            By continuing, you agree to our{' '}
            <Text className="text-[#0A9D5C]">Terms of Service</Text>
            {'\n'}and{' '}
            <Text className="text-[#0A9D5C]">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
