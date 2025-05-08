import React from 'react';
import { Stack } from 'expo-router';
import "../global.css";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ headerShown: false }} />
      <Stack.Screen name="chatbot" options={{ headerShown: false }} />
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