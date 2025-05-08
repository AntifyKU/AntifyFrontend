import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ExploreScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    // Request permission to access the photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      // Get the selected asset
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
      
      // Navigate to detail screen with the selected image
      router.push({
        pathname: '/detail',
        params: { imageUri: selectedAsset.uri }
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#e8f0d0]">
      <ScrollView className="flex-1 pt-4">
        <View className="px-5 pb-4">
          <Text className="text-3xl font-bold text-black">Show your Ant</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location" size={18} color="#000" />
            <Text className="ml-1 text-black">Thailand</Text>
          </View>
        </View>

        <View className="flex-row px-5 mb-6">
          <TouchableOpacity 
            className="bg-[#8DD3B7] rounded-lg p-4 mr-3 flex-1 items-center"
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="camera" size={24} color="#000" />
            <Text className="mt-1 text-lg font-semibold text-black">From Camera</Text>
            <Text className="text-xs text-black">Straight from Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#0A9D5C] rounded-lg p-4 flex-1 items-center"
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color="#000" />
            <Text className="mt-1 text-lg font-semibold text-black">From Gallery</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mb-4">
          <Text className="mb-5 text-2xl font-bold text-black">Ant Topics</Text>
          
          <TouchableOpacity className="justify-end h-24 mb-6 bg-transparent rounded-lg">
            <Text className="text-2xl font-bold text-white">Ant in Thailand</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="justify-end h-24 mb-6 bg-transparent rounded-lg">
            <Text className="text-2xl font-bold text-white">Poisonous ants</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="justify-end h-24 mb-6 bg-transparent rounded-lg">
            <Text className="text-2xl font-bold text-white">Allergic</Text>
          </TouchableOpacity>
        </View>
        
        {/* Add extra space at the bottom to ensure content doesn't get hidden behind tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}