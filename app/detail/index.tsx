import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Define the type for route params
type DetailParams = {
  imageUri?: string;
  source?: string; // 'camera', 'gallery'
};

export default function DetailRedirect() {
  const params = useLocalSearchParams<DetailParams>();
  const { imageUri, source } = params;
  
  useEffect(() => {
    // If we have an image URI, redirect to the detail page for the first ant
    // with the image URI and source as parameters
    if (imageUri) {
      router.replace({
        pathname: '/detail/[id]', // Default to the first ant
        params: { id: '1', imageUri, source }
      });
    } else {
      // If no image URI, just go back to the explore page
      router.replace('/');
    }
  }, [imageUri, source]);
  
  // Show a loading indicator while redirecting
  return (
    <View className="flex-1 items-center justify-center bg-[#f5f7e8]">
      <ActivityIndicator size="large" color="#328e6e" />
    </View>
  );
}