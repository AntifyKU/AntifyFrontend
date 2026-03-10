import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Location from "expo-location";
import SectionHeader from "@/components/molecule/SectionHeader";
import AntCard from "@/components/molecule/AntCard";
import CardItem from "@/components/molecule/CardItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useSpecies } from "@/hooks/useSpecies";
import {
  quickDiscoveryCategories,
  featuredAntOfTheDay as staticAntOfTheDay,
  featuredSpeciesList as staticFeaturedList,
} from "@/constants/AntData";
import { useAuth } from "@/context/AuthContext";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { openIdentifySheet } from "@/utils/identifyHelper";

export default function HomeScreen() {
  const [location, setLocation] = useState("Loading...");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const { user } = useAuth();

  const {
    species,
    loading: speciesLoading,
    isUsingFallback,
  } = useSpecies({
    filters: { limit: 10 },
  });

  const { featuredAntOfTheDay, featuredSpeciesList } = useMemo(() => {
    if (species.length > 0) {
      const antOfTheDay = {
        id: species[0].id,
        name: species[0].name,
        scientificName: species[0].scientific_name,
        image: species[0].image || "",
      };
      const featuredList = species.slice(1, 6).map((s) => ({
        id: s.id,
        name: s.name,
        scientificName: s.scientific_name,
        image: s.image || "",
      }));
      return {
        featuredAntOfTheDay: antOfTheDay,
        featuredSpeciesList:
          featuredList.length > 0 ? featuredList : staticFeaturedList,
      };
    }
    return {
      featuredAntOfTheDay: staticAntOfTheDay,
      featuredSpeciesList: staticFeaturedList,
    };
  }, [species]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Location permission denied");
        setIsLoadingLocation(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      if (address) {
        const displayLocation =
          address.city || address.subregion || address.region;
        const displayCountry = address.country;
        if (displayLocation && displayCountry) {
          setLocation(`${displayLocation}, ${displayCountry}`);
        } else if (displayLocation) {
          setLocation(displayLocation);
        } else if (address.formattedAddress) {
          setLocation(address.formattedAddress);
        } else {
          setLocation("Unknown location");
        }
      } else {
        setLocation("Unknown location");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocation("Unable to get location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAntPress = (antId: string) => {
    router.push({
      pathname: `/detail/[id]`,
      params: { id: antId },
    });
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { category: categoryName },
    });
  };

  const handleLocationPress = () => {
    if (location === "Location permission denied") {
      Alert.alert(
        "Location Permission",
        "Please enable location permission in your device settings to see your current location.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: getLocation },
        ],
      );
    } else {
      getLocation();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-3 pb-5">
          <ScreenHeader />
        </View>

        {/* Your Location Section */}
        <Pressable
          className="flex-row items-start justify-between px-5 mb-6"
          onPress={handleLocationPress}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Your Location
            </Text>
            <View className="flex-row items-center mt-1">
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#328e6e" />
              ) : (
                <Text className="text-gray-500">{location}</Text>
              )}
            </View>
          </View>
          <MaterialIcons name="location-on" size={30} color="#328e6e" />
        </Pressable>

        {/* Identify Ant Button */}
        <View className="px-5 mb-6">
          <PrimaryButton
            title="Identify Ant"
            icon="camera"
            onPress={openIdentifySheet}
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
                {tag.name === "Venomous" ? (
                  <MaterialCommunityIcons
                    name="alert"
                    size={16}
                    color={tag.color}
                  />
                ) : tag.name === "Forest" ? (
                  <MaterialCommunityIcons
                    name="tree"
                    size={16}
                    color={tag.color}
                  />
                ) : tag.name === "Household" ? (
                  <Ionicons name="home" size={16} color={tag.color} />
                ) : (
                  <Ionicons name="sparkles" size={16} color={tag.color} />
                )}
                <Text className="ml-2 text-gray-700 font-medium">
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ant of the Day Section */}
        <View className="mb-6">
          <SectionHeader title="Ant of the Day" />
          <View className="px-5">
            {speciesLoading ? (
              <View className="h-48 items-center justify-center bg-gray-50 rounded-xl">
                <ActivityIndicator size="small" color="#328e6e" />
                <Text className="mt-2 text-gray-500">Loading...</Text>
              </View>
            ) : (
              <CardItem
                variant="species"
                name={featuredAntOfTheDay.name}
                scientificName={featuredAntOfTheDay.scientificName}
                imageUri={featuredAntOfTheDay.image}
                accentColor="#328e6e"
                onPress={() => handleAntPress(featuredAntOfTheDay.id)}
                showMore={false}
                backgroundColor="#e8f5e0"
              />
            )}
          </View>
        </View>

        {/* Featured Species Section */}
        <View className="mb-8">
          <SectionHeader
            title="Featured Species"
            subtitle="Discover common Thai ants"
            showSeeMore
            onSeeMorePress={() => router.push("/(tabs)/explore")}
          />

          {speciesLoading ? (
            <View className="h-32 items-center justify-center">
              <ActivityIndicator size="small" color="#328e6e" />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 10,
                gap: 12,
              }}
            >
              {featuredSpeciesList.map((item) => (
                <View key={item.id} style={{ width: 200 }}>
                  <CardItem
                    variant="species"
                    name={item.name}
                    scientificName={item.scientificName}
                    imageUri={item.image}
                    accentColor="#328e6e"
                    onPress={() => handleAntPress(item.id)}
                    showMore={false}
                  />
                </View>
              ))}
            </ScrollView>
          )}
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
