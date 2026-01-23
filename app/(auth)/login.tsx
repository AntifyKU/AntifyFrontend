import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TextInput from '@/components/TextInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validateForm(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validateForm()) return;

    try {
      await login(email, password);
      // Navigation is handled by _layout.tsx based on auth state
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Unable to log in. Please check your credentials and try again.'
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <TouchableOpacity
              onPress={() => router.replace('/welcome')}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-6 pt-8">
            {/* Logo / Title */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                <Ionicons name="leaf" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
              <Text className="text-gray-500 mt-2">Sign in to continue</Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <TextInput
                label="Email"
                icon="mail-outline"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                containerStyle={{ marginBottom: 16 }}
              />

              <TextInput
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                containerStyle={{ marginBottom: 8 }}
              />

              <TouchableOpacity className="self-end mb-6">
                <Text className="text-[#0A9D5C] font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <View className="mb-6">
              <PrimaryButton
                title={isLoading ? 'Signing in...' : 'Sign In'}
                onPress={handleLogin}
                disabled={isLoading}
                icon={isLoading ? undefined : 'log-in-outline'}
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-400">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Social Login (placeholder) */}
            <TouchableOpacity className="flex-row items-center justify-center py-4 border border-gray-200 rounded-full mb-4">
              <Ionicons name="logo-google" size={20} color="#333" />
              <Text className="ml-3 text-gray-700 font-medium">Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="px-6 pb-8">
            <View className="flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-[#0A9D5C] font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-2xl p-6">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-3 text-gray-600">Signing in...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
