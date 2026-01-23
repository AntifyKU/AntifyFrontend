/**
 * App Preferences Settings Screen
 * Allows users to configure app preferences like language, theme, and notifications
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';

type Language = 'english' | 'thai';
type Theme = 'light' | 'dark' | 'system';

export default function PreferencesScreen() {
  const { user, token, refreshUser } = useAuth();
  
  // Get current preferences from user
  const currentPrefs = user?.preferences || {
    language: 'english',
    theme: 'light',
    notifications_enabled: true,
  };
  
  const [language, setLanguage] = useState<Language>(currentPrefs.language as Language);
  const [theme, setTheme] = useState<Theme>(currentPrefs.theme as Theme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(currentPrefs.notifications_enabled);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      await authService.updateProfile(token, {
        preferences: {
          language,
          theme,
          notifications_enabled: notificationsEnabled,
        },
      });
      await refreshUser();
      Alert.alert('Success', 'Preferences saved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const OptionButton = ({ 
    label, 
    selected, 
    onPress 
  }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className={`flex-1 py-3 rounded-lg items-center ${
        selected ? 'bg-[#22A45D]' : 'bg-gray-100'
      }`}
      onPress={onPress}
    >
      <Text className={`font-medium ${selected ? 'text-white' : 'text-gray-600'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#22A45D" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-800 text-center mr-7">
          App Preferences
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="language-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-3">Language</Text>
          </View>
          <View className="flex-row gap-3">
            <OptionButton
              label="English"
              selected={language === 'english'}
              onPress={() => setLanguage('english')}
            />
            <OptionButton
              label="Thai"
              selected={language === 'thai'}
              onPress={() => setLanguage('thai')}
            />
          </View>
        </View>

        {/* Theme Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="color-palette-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-3">Theme</Text>
          </View>
          <View className="flex-row gap-3">
            <OptionButton
              label="Light"
              selected={theme === 'light'}
              onPress={() => setTheme('light')}
            />
            <OptionButton
              label="Dark"
              selected={theme === 'dark'}
              onPress={() => setTheme('dark')}
            />
            <OptionButton
              label="System"
              selected={theme === 'system'}
              onPress={() => setTheme('system')}
            />
          </View>
          <Text className="text-gray-500 text-sm mt-3">
            Dark mode coming soon! Currently only light mode is supported.
          </Text>
        </View>

        {/* Notifications Section */}
        <View className="py-6 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="notifications-outline" size={24} color="#22A45D" />
              <View className="ml-3 flex-1">
                <Text className="text-lg font-semibold text-gray-800">Notifications</Text>
                <Text className="text-gray-500 text-sm">Receive updates about new species and features</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
              thumbColor={notificationsEnabled ? '#22A45D' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="py-8">
          <TouchableOpacity
            className={`py-4 rounded-xl items-center ${
              isSaving ? 'bg-gray-300' : 'bg-[#22A45D]'
            }`}
            onPress={handleSavePreferences}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Save Preferences</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Additional Settings */}
        <View className="pb-10">
          <Text className="text-gray-500 text-sm text-center">
            More preferences will be available in future updates.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
