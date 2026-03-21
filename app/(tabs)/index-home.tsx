import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import CardItem from "@/components/molecule/CardItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useSpecies } from "@/hooks/useSpecies";
import { quickDiscoveryCategories } from "@/constants/Filters";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { openIdentifySheet } from "@/utils/identifyHelper";
import { useTranslation } from "react-i18next";
import AntTopicsSection from "@/components/organism/AntTopicsSection";

function getDailyIndex(listLength: number): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const randomValue = Math.sin(seed) * 10000;
  return Math.floor((randomValue - Math.floor(randomValue)) * listLength);
}

function toSpeciesCard(s: {
  id: string;
  name: string;
  scientific_name: string;
  image?: string;
}) {
  return {
    id: s.id,
    name: s.name,
    scientificName: s.scientific_name,
    image: s.image || "",
  };
}

function getAntProvinces(s: {
  distribution_v2?: { provinces?: string[] };
}): string[] {
  return s.distribution_v2?.provinces?.map((p) => p.toLowerCase()) ?? [];
}

function antMatchesUserLocation(
  antProvinces: string[],
  userLocations: string[],
): boolean {
  return antProvinces.some((p) =>
    userLocations.some((userLoc) => userLoc.includes(p) || p.includes(userLoc)),
  );
}

function getLocalSpecies(
  species: {
    id: string;
    name: string;
    scientific_name: string;
    image?: string;
    distribution_v2?: { provinces?: string[] };
  }[],
  locationObj: Location.LocationGeocodedAddress,
) {
  const userLocations: string[] = [
    locationObj.city,
    locationObj.subregion,
    locationObj.region,
  ]
    .filter((loc): loc is string => typeof loc === "string" && loc.length > 0)
    .map((loc) => loc.toLowerCase());

  return species
    .filter((s) => antMatchesUserLocation(getAntProvinces(s), userLocations))
    .slice(0, 10)
    .map(toSpeciesCard);
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState(t("home.loading"));
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationObj, setLocationObj] =
    useState<Location.LocationGeocodedAddress | null>(null);
  const { species, loading: speciesLoading } = useSpecies({
    filters: { limit: 500 },
  });

  const getLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation(t("home.location_denied"));
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
        setLocationObj(address);
        if (displayLocation && displayCountry) {
          setLocation(`${displayLocation}, ${displayCountry}`);
        } else if (displayLocation) {
          setLocation(displayLocation);
        } else if (address.formattedAddress) {
          setLocation(address.formattedAddress);
        } else {
          setLocation(t("home.unknown_location"));
        }
      } else {
        setLocationObj(null);
        setLocation(t("home.unknown_location"));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocation(t("home.unable_to_get_location"));
    } finally {
      setIsLoadingLocation(false);
    }
  }, [t]);

  const { featuredAntOfTheDay, featuredSpeciesList, localSpeciesList } =
    useMemo(() => {
      if (species.length === 0) {
        return {
          featuredAntOfTheDay: null,
          featuredSpeciesList: [],
          localSpeciesList: [],
        };
      }

      const antOfTheDay = toSpeciesCard(species[getDailyIndex(species.length)]);
      const featuredList = species.slice(0, 5).map(toSpeciesCard);
      const localList = locationObj
        ? getLocalSpecies(species, locationObj)
        : [];

      return {
        featuredAntOfTheDay: antOfTheDay,
        featuredSpeciesList: featuredList,
        localSpeciesList: localList,
      };
    }, [species, locationObj]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleAntPress = (antId: string) => {
    router.push({ pathname: `/detail/[id]`, params: { id: antId } });
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { category: categoryName },
    });
  };

  const handleLocationPress = () => {
    if (location === t("home.location_denied")) {
      Alert.alert(
        t("home.alert.location_title"),
        t("home.alert.location_message"),
        [
          { text: t("home.alert.cancel"), style: "cancel" },
          {
            text: t("home.alert.retry"),
            onPress: () => {
              getLocation();
            },
          },
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
        <View className="pt-4 pb-5">
          <ScreenHeader />
        </View>

        <Pressable
          className="flex-row items-start justify-between px-5 mb-6"
          onPress={handleLocationPress}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <View>
            <Text className="text-xl font-bold text-gray-900">
              {t("home.your_location")}
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

        <View className="px-5 mb-6">
          <PrimaryButton
            title={t("home.identify_ant")}
            icon="camera"
            onPress={openIdentifySheet}
            size="large"
          />
        </View>

        <View className="mb-6">
          <SectionHeader title={t("home.quick_discovery")} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {quickDiscoveryCategories.map((tag) => {
              let icon;
              const translatedName = t(
                `home.categories.${tag.name.toLowerCase()}`,
                { defaultValue: tag.name },
              );

              if (tag.name === "Venomous") {
                icon = (
                  <MaterialCommunityIcons
                    name="alert"
                    size={16}
                    color={tag.color}
                  />
                );
              } else if (tag.name === "Forest") {
                icon = (
                  <MaterialCommunityIcons
                    name="tree"
                    size={16}
                    color={tag.color}
                  />
                );
              } else if (tag.name === "Household") {
                icon = <Ionicons name="home" size={16} color={tag.color} />;
              } else {
                icon = <Ionicons name="sparkles" size={16} color={tag.color} />;
              }

              return (
                <TouchableOpacity
                  key={tag.id}
                  className="mr-3 flex-row items-center px-4 py-2 rounded-full border border-gray-200 bg-white"
                  onPress={() => handleCategoryPress(tag.name)}
                >
                  {icon}
                  <Text className="ml-2 text-gray-700 font-medium">
                    {translatedName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="mb-6">
          <SectionHeader title={t("home.ant_of_the_day")} />
          <View className="px-5">
            {speciesLoading || !featuredAntOfTheDay ? (
              <View className="h-48 items-center justify-center bg-gray-50 rounded-xl">
                <ActivityIndicator size="small" color="#328e6e" />
                <Text className="mt-2 text-gray-500">{t("home.loading")}</Text>
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

        <View className="mb-8">
          <SectionHeader
            title={t("home.featured_species")}
            subtitle={t("home.discover_thai_ants")}
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

        {localSpeciesList.length > 0 && (
          <View className="mb-8">
            <SectionHeader
              title={t("home.species_near", {
                location:
                  locationObj?.city ||
                  locationObj?.subregion ||
                  t("home.unknown_location"),
              })}
              subtitle={t("home.found_in_province")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 10,
                gap: 12,
              }}
            >
              {localSpeciesList.map((item) => (
                <View key={item.id} style={{ width: 200 }}>
                  <CardItem
                    variant="species"
                    name={item.name}
                    scientificName={item.scientificName}
                    imageUri={item.image}
                    accentColor="#0A9D5C"
                    onPress={() => handleAntPress(item.id)}
                    showMore={false}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Ant Topics & Tips Section */}
        <AntTopicsSection />

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