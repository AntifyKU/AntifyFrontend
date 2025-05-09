import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  StatusBar,
  Alert,
  Linking
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';

export default function ExploreScreen() {
  const [location, setLocation] = useState('Bangkok, Thailand');

  // Mock data for the different sections with working image URLs
  const nearbyAnts = [
    { id: '1', name: 'Weaver Ant', description: 'Oecophylla smaragdina', image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg' },
    { id: '2', name: 'Carpenter Ant', description: 'Camponotus cf. eugeniae', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Carpenter_ant_Tanzania_crop.jpg' },
    { id: '3', name: 'Fire Ant', description: 'Solenopsis invicta', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxO4D319sBerXRBC58SSvMjWm5SHZEbV2iF7siCvIUqEPyu_DOc_c7GJSNoRoZ7FMj77nL1Hit4D0P9Oeympiaw' },
  ];

  const recentNews = [
    { 
      id: '1', 
      title: 'Extraordinary fossil reveals the oldest ant species known to science', 
      description: 'April 27, 2025', 
      link: 'https://edition.cnn.com/2025/04/24/science/fossil-oldest-known-ant/index.html',
      image: 'https://media.cnn.com/api/v1/images/stellar/prod/ant-fossil-photograph-credit-anderson-lepeco.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp'
    },
    { 
      id: '2', 
      title: 'Spread of Australia’s red fire ant population has sent 23 people to hospital', 
      description: 'March 24, 2025', 
      link: 'https://edition.cnn.com/2025/03/24/science/australia-fire-ants-spread-intl-scli/index.html',
      image: 'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1465224290.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp'
    },
  ];

  const poisonousAnts = [
    { id: '4', name: 'Bullet Ant', description: 'Paraponera clavata', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Paraponera_clavata.jpg/500px-Paraponera_clavata.jpg' },
    { id: '3', name: 'Fire Ant', description: 'Solenopsis invicta', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxO4D319sBerXRBC58SSvMjWm5SHZEbV2iF7siCvIUqEPyu_DOc_c7GJSNoRoZ7FMj77nL1Hit4D0P9Oeympiaw' },
    { id: '5', name: 'Harvester Ant', description: 'Pogonomyrmex', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Florida_harvester_ant_teamwork%21_%28Pogonomyrmex_badius%29_%286502194585%29.jpg' },
  ];

  // Update the handleAntPress function in the explore screen
  const handleAntPress = (antId: string) => {
    router.push({
      pathname: `/detail/[id]`,
      params: { id: antId }
    });
  };


  const handleNewsPress = async (newsUrl: string) => {
    try {
      // Open the URL in an in-app browser
      await WebBrowser.openBrowserAsync(newsUrl);
    } catch (error) {
      console.error("Error opening URL:", error);
      // Fallback to regular Linking if WebBrowser fails
      const canOpen = await Linking.canOpenURL(newsUrl);
      if (canOpen) {
        await Linking.openURL(newsUrl);
      } else {
        Alert.alert("Cannot open URL", "The link cannot be opened.");
      }
    }
  };

  // Update the handleTakePhoto function
  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission to use this feature."
        );
        return;
      }
      
      // Launch camera directly
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      // Handle the result
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        console.log("Image captured:", capturedImage.uri);
        
        // Navigate to detail page with the captured image
        router.push({
          pathname: '/detail/index',
          params: { imageUri: capturedImage.uri, source: 'camera' }
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(
        "Error",
        "There was a problem taking the photo. Please try again."
      );
    }
  };

    // Update the handleUploadPhoto function
  const handleUploadPhoto = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant gallery access to use this feature."
        );
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      // Handle the result
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        console.log("Image selected:", selectedImage.uri);
        
        // Navigate to detail page with the selected image
        router.push({
          pathname: '/detail/index',
          params: { imageUri: selectedImage.uri, source: 'gallery' }
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert(
        "Error",
        "There was a problem selecting the photo. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1">
        {/* Header with search */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View className="flex-1" />
        </View>
        
        {/* Camera and Upload Section - BIGGER BUTTONS */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="flex-1 bg-[#e1eebc] rounded-xl py-6 mr-3 flex-row justify-center items-center"
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={32} color="#328e6e" />
              <Text className="ml-3 font-semibold text-[#328e6e] text-lg">Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-[#e1eebc] rounded-xl py-6 ml-3 flex-row justify-center items-center"
              onPress={handleUploadPhoto}
            >
              <MaterialCommunityIcons name="image-plus" size={32} color="#328e6e" />
              <Text className="ml-3 font-semibold text-[#328e6e] text-lg">Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Location section */}
        <View className="flex-row items-start justify-between px-5 mb-6">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Your Location</Text>
            <Text className="mt-1 text-lg text-gray-500">{location}</Text>
          </View>
          <MaterialIcons name="location-on" size={28} color="#328e6e" />
        </View>
        
        {/* Found in your area section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-2xl font-bold text-gray-800">Found in your area</Text>
            <TouchableOpacity>
              <Text className="text-[#328e6e] text-base font-medium">See more</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {nearbyAnts.map((ant) => (
              <TouchableOpacity 
                key={ant.id}
                className="mr-4 w-[250px]"
                onPress={() => handleAntPress(ant.id)}
              >
                <View className="bg-[#e1eebc] rounded-lg overflow-hidden">
                  <Image 
                    source={{ uri: ant.image }} 
                    className="h-[200px] w-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="mt-2 text-xl font-semibold">{ant.name}</Text>
                <Text className="text-gray-500">{ant.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Recent news section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-2xl font-bold text-gray-800">Recent news</Text>
            <TouchableOpacity>
              <Text className="text-[#328e6e] text-base font-medium">See more</Text>
            </TouchableOpacity>
          </View>
          
          <View className="px-5">
            {recentNews.map((news) => (
              <TouchableOpacity 
                key={news.id}
                className="mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg"
                onPress={() => handleNewsPress(news.link)}
              >
                <Image 
                  source={{ uri: news.image }} 
                  className="w-full h-[160px]"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="mb-1 text-lg font-semibold">{news.title}</Text>
                  <Text className="mb-2 text-gray-500">{news.description}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="globe-outline" size={16} color="#328e6e" />
                    <Text className="text-[#328e6e] text-xs ml-1 flex-1">
                      {news.link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </Text>
                    <Text className="text-[#328e6e] font-medium">Read more</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Poisonous ants section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-2xl font-bold text-gray-800">Poisonous ants</Text>
            <TouchableOpacity>
              <Text className="text-[#328e6e] text-base font-medium">See more</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {poisonousAnts.map((ant) => (
              <TouchableOpacity 
                key={ant.id}
                className="mr-4 w-[250px]"
                onPress={() => handleAntPress(ant.id)}
              >
                <View className="bg-[#e1eebc] rounded-lg overflow-hidden">
                  <Image 
                    source={{ uri: ant.image }} 
                    className="h-[200px] w-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="mt-2 text-xl font-semibold">{ant.name}</Text>
                <Text className="text-gray-500">{ant.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Bottom padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}