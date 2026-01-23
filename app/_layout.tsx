import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import "../global.css";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // Initialize push notifications
  useNotifications();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    const inAuthGroup = segments[0] === '(auth)';
    const inWelcome = segments[0] === 'welcome';

    if (!isAuthenticated) {
      // User is not signed in
      if (!inAuthGroup && !inWelcome) {
        // Redirect to welcome page
        router.replace('/welcome');
      }
    } else {
      // User is signed in
      if (inAuthGroup || inWelcome) {
        // Redirect to main app
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0A9D5C" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ headerShown: false }} />
      <Stack.Screen name="chatbot" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen 
        name="feedback" 
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom'
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
