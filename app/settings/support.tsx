/**
 * Support & Info Settings Screen
 * Provides app information, help, and support options
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const supportItems = [
  {
    id: 'help',
    title: 'Help Center',
    icon: 'help-circle-outline' as const,
    description: 'Get answers to common questions',
    action: 'help',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    icon: 'chatbubble-outline' as const,
    description: 'Help us improve Antify',
    action: 'feedback',
  },
  {
    id: 'rate',
    title: 'Rate the App',
    icon: 'star-outline' as const,
    description: 'Leave a review on the App Store',
    action: 'rate',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: 'mail-outline' as const,
    description: 'Get in touch with our team',
    action: 'contact',
  },
];

const infoItems = [
  {
    id: 'about',
    title: 'About Antify',
    icon: 'information-circle-outline' as const,
    action: 'about',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: 'document-text-outline' as const,
    action: 'terms',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline' as const,
    action: 'privacy',
  },
  {
    id: 'licenses',
    title: 'Open Source Licenses',
    icon: 'code-outline' as const,
    action: 'licenses',
  },
];

export default function SupportInfoScreen() {
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  const handleAction = (action: string) => {
    switch (action) {
      case 'help':
        Alert.alert(
          'Help Center',
          'Our help center is coming soon! In the meantime, please contact us via email for any questions.',
          [{ text: 'OK' }]
        );
        break;
      case 'feedback':
        router.push('/feedback');
        break;
      case 'rate':
        Alert.alert(
          'Rate Antify',
          'Thank you for wanting to rate us! The App Store link will be available once the app is published.',
          [{ text: 'OK' }]
        );
        break;
      case 'contact':
        Linking.openURL('mailto:support@antify.app?subject=Antify%20Support%20Request');
        break;
      case 'about':
        Alert.alert(
          'About Antify',
          'Antify is an ant identification app designed specifically for Thailand. Our mission is to help people discover and learn about the fascinating world of ants.\n\nDeveloped with love for entomology.',
          [{ text: 'OK' }]
        );
        break;
      case 'terms':
        Alert.alert('Terms of Service', 'Terms of Service will be available soon.', [{ text: 'OK' }]);
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Privacy Policy will be available soon.', [{ text: 'OK' }]);
        break;
      case 'licenses':
        Alert.alert(
          'Open Source Licenses',
          'Antify uses the following open source libraries:\n\n• React Native\n• Expo\n• NativeWind\n• Firebase\n\nFull license information will be available soon.',
          [{ text: 'OK' }]
        );
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#22A45D" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-800 text-center mr-7">
          Support & Info
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Support Section */}
        <View className="px-5 pt-6">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Support
          </Text>
          <View className="bg-gray-50 rounded-xl overflow-hidden">
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center py-4 px-4 ${
                  index < supportItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
                onPress={() => handleAction(item.action)}
              >
                <View className="w-10 h-10 rounded-full bg-[#22A45D]/10 items-center justify-center">
                  <Ionicons name={item.icon} size={22} color="#22A45D" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base text-gray-800 font-medium">{item.title}</Text>
                  <Text className="text-sm text-gray-500">{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View className="px-5 pt-8">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Information
          </Text>
          <View className="bg-gray-50 rounded-xl overflow-hidden">
            {infoItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center py-4 px-4 ${
                  index < infoItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
                onPress={() => handleAction(item.action)}
              >
                <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                  <Ionicons name={item.icon} size={22} color="#6B7280" />
                </View>
                <Text className="flex-1 ml-3 text-base text-gray-800 font-medium">{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View className="px-5 pt-10 pb-8 items-center">
          <View className="w-16 h-16 rounded-2xl bg-[#22A45D] items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">A</Text>
          </View>
          <Text className="text-gray-800 font-semibold text-lg">Antify</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Version {appVersion} ({buildNumber})
          </Text>
          <Text className="text-gray-400 text-xs mt-4">
            Made with love for ant enthusiasts
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
