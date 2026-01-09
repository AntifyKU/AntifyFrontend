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
  ActionSheetIOS,
  Platform,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState('Loading...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Quick discovery categories
  const quickDiscoveryTags = [
    { id: '1', name: 'Venomous', icon: 'alert', color: '#FF6B35' },
    { id: '2', name: 'Forest', icon: 'leaf', color: '#328e6e' },
    { id: '3', name: 'Household', icon: 'home', color: '#328e6e' },
    { id: '4', name: 'Hou', icon: 'sparkles', color: '#328e6e' },
  ];

  // Ant of the day
  const antOfTheDay = {
    id: '1',
    name: 'Porem ipsum',
    description: 'Worem ipsum',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg'
  };

  // Featured species
  const featuredSpecies = [
    { id: '1', name: 'Porem ipsum', description: 'Worem ipsum', image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg' },
    { id: '2', name: 'Porem ipsun', description: 'Worem ipsum', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Carpenter_ant_Tanzania_crop.jpg' },
    { id: '3', name: 'Porem ipsum', description: 'Worem ipsum', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxO4D319sBerXRBC58SSvMjWm5SHZEbV2iF7siCvIUqEPyu_DOc_c7GJSNoRoZ7FMj77nL1Hit4D0P9Oeympiaw' },
  ];

  // Get user's location on mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocation('Location permission denied');
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address) {
        // Format the address
        const locationParts = [];
        if (address.district) locationParts.push(address.district);
        if (address.city) locationParts.push(address.city);
        if (address.region) locationParts.push(address.region);
        if (address.country) locationParts.push(address.country);

        // Use subregion or city, and country
        const displayLocation = address.city || address.subregion || address.region;
        const displayCountry = address.country;

        if (displayLocation && displayCountry) {
          setLocation(`${displayLocation}, ${displayCountry}`);
        } else if (displayLocation) {
          setLocation(displayLocation);
        } else if (address.formattedAddress) {
          setLocation(address.formattedAddress);
        } else {
          setLocation('Unknown location');
        }
      } else {
        setLocation('Unknown location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocation('Unable to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAntPress = (antId: string) => {
    router.push({
      pathname: `/detail/[id]`,
      params: { id: antId }
    });
  };

  // Handle camera photo
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission to use this feature."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        router.push({
          pathname: '/detail/[id]',
          params: { id: 'new', imageUri: capturedImage.uri, source: 'camera' }
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "There was a problem taking the photo. Please try again.");
    }
  };

  // Handle upload photo from gallery
  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant gallery access to use this feature."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        router.push({
          pathname: '/detail/[id]',
          params: { id: 'new', imageUri: selectedImage.uri, source: 'gallery' }
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "There was a problem selecting the photo. Please try again.");
    }
  };

  // Handle Identify Ant button - show action sheet to choose camera or gallery
  const handleIdentifyAnt = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handleUploadPhoto();
          }
        }
      );
    } else {
      Alert.alert(
        'Identify Ant',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: handleTakePhoto },
          { text: 'Choose from Gallery', onPress: handleUploadPhoto },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/(tabs)/explore',
      params: { category: categoryName }
    });
  };

  // Handle location press - refresh or open settings
  const handleLocationPress = () => {
    if (location === 'Location permission denied') {
      Alert.alert(
        'Location Permission',
        'Please enable location permission in your device settings to see your current location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: getLocation },
        ]
      );
    } else {
      // Refresh location
      getLocation();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with notification */}
        <View className="flex-row items-center justify-end px-5 pt-2 pb-2">
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Your Location Section */}
        <TouchableOpacity
          className="flex-row items-start justify-between px-5 mb-6"
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <View>
            <Text className="text-xl font-bold text-gray-800">Your Location</Text>
            <View className="flex-row items-center mt-1">
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#328e6e" />
              ) : (
                <Text className="text-gray-500">{location}</Text>
              )}
            </View>
          </View>
          <MaterialIcons name="location-on" size={24} color="#328e6e" />
        </TouchableOpacity>

        {/* Identify Ant Button */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            className="bg-[#328e6e] rounded-full py-4 flex-row justify-center items-center"
            onPress={handleIdentifyAnt}
            style={{
              shadowColor: '#328e6e',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="camera" size={22} color="#fff" />
            <Text className="ml-3 font-semibold text-white text-base">Identify Ant</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Discovery Section */}
        <View className="mb-6">
          <Text className="px-5 mb-3 text-lg font-bold text-gray-800">Quick Discovery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {quickDiscoveryTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                className="mr-3 flex-row items-center px-4 py-2 rounded-full border border-gray-200 bg-white"
                onPress={() => handleCategoryPress(tag.name)}
              >
                {tag.name === 'Venomous' ? (
                  <MaterialCommunityIcons name="alert" size={16} color={tag.color} />
                ) : tag.name === 'Forest' ? (
                  <MaterialCommunityIcons name="tree" size={16} color={tag.color} />
                ) : tag.name === 'Household' ? (
                  <Ionicons name="home" size={16} color={tag.color} />
                ) : (
                  <Ionicons name="sparkles" size={16} color={tag.color} />
                )}
                <Text className="ml-2 text-gray-700 font-medium">{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ant of the Day Section */}
        <View className="mb-6">
          <Text className="px-5 mb-3 text-lg font-bold text-gray-800">Ant of the Day</Text>
          <View className="px-5">
            <TouchableOpacity
              className="bg-[#e8f5e0] rounded-xl overflow-hidden"
              onPress={() => handleAntPress(antOfTheDay.id)}
            >
              <Image
                source={{ uri: antOfTheDay.image }}
                className="h-40 w-full"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-lg font-semibold text-gray-800">{antOfTheDay.name}</Text>
                <Text className="text-gray-500">{antOfTheDay.description}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Species Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-5 mb-3">
            <View>
              <Text className="text-lg font-bold text-gray-800">Featured Species</Text>
              <Text className="text-gray-500 text-sm">Discover common Thai ants</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-[#328e6e] font-medium">See more</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {featuredSpecies.map((species) => (
              <TouchableOpacity
                key={species.id}
                className="mr-4 w-[160px]"
                onPress={() => handleAntPress(species.id)}
              >
                <View className="bg-[#e8f5e0] rounded-xl overflow-hidden">
                  <Image
                    source={{ uri: species.image }}
                    className="h-28 w-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="mt-2 font-semibold text-gray-800">{species.name}</Text>
                <Text className="text-gray-500 text-sm">{species.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}