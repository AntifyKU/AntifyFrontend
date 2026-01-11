import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import SectionHeader from '@/components/SectionHeader';
import AntCard from '@/components/AntCard';
import PrimaryButton from '@/components/PrimaryButton';
import {
  quickDiscoveryCategories,
  featuredAntOfTheDay,
  featuredSpeciesList
} from '@/constants/AntData';

export default function HomeScreen() {
  const [location, setLocation] = useState('Loading...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

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
          pathname: '/identification-results',
          params: { imageUri: capturedImage.uri, source: 'camera' }
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
          pathname: '/identification-results',
          params: { imageUri: selectedImage.uri, source: 'gallery' }
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
        <Pressable
          className="flex-row items-start justify-between px-5 mb-6"
          onPress={handleLocationPress}
          style={({ pressed }) => pressed && styles.pressed}
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
        </Pressable>

        {/* Identify Ant Button */}
        <View className="px-5 mb-6">
          <PrimaryButton
            title="Identify Ant"
            icon="camera"
            onPress={handleIdentifyAnt}
            size="large"
          />
        </View>

        {/* Quick Discovery Section */}
        <View className="mb-6">
          <SectionHeader title="Quick Discovery" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {quickDiscoveryCategories.map((tag) => (
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
          <SectionHeader title="Ant of the Day" />
          <View className="px-5">
            <AntCard
              id={featuredAntOfTheDay.id}
              name={featuredAntOfTheDay.name}
              description={featuredAntOfTheDay.scientificName}
              image={featuredAntOfTheDay.image}
              variant="vertical"
              onPress={() => handleAntPress(featuredAntOfTheDay.id)}
            />
          </View>
        </View>

        {/* Featured Species Section */}
        <View className="mb-8">
          <SectionHeader
            title="Featured Species"
            subtitle="Discover common Thai ants"
            showSeeMore
            onSeeMorePress={() => router.push('/(tabs)/explore')}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {featuredSpeciesList.map((species) => (
              <AntCard
                key={species.id}
                id={species.id}
                name={species.name}
                scientificName={species.scientificName}
                image={species.image}
                variant="compact"
                onPress={() => handleAntPress(species.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});