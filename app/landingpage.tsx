import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require('../assets/images/icon.png')}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
    </View>
  );
}
