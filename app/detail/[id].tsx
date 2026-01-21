"use client"

import {
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { antSpeciesData } from "@/constants/AntData"
import FilterChip from "@/components/FilterChip"
import { useSpeciesDetail } from "@/hooks/useSpeciesDetail"

// Define the type for route params
type DetailParams = {
  id: string
}

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>()
  const { id } = params

  // Fetch species data from API with fallback to static data
  const { species, loading, error, isUsingFallback } = useSpeciesDetail(id)

  // Transform API species to display format
  const currentAnt = species ? {
    id: species.id,
    name: species.name,
    scientificName: species.scientific_name,
    classification: species.classification,
    tags: species.tags,
    about: species.about,
    characteristics: species.characteristics,
    colors: species.colors,
    habitat: species.habitat,
    distribution: species.distribution,
    behavior: species.behavior,
    ecologicalRole: species.ecological_role,
    image: species.images?.[0] || '',
  } : antSpeciesData[0]

  const handleBackPress = () => {
    router.back()
  }

  // Show loading state
  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0A9D5C" />
        <Text className="mt-4 text-gray-600">Loading species details...</Text>
      </View>
    )
  }

  // Show error state if no data available
  if (!species && !loading) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView edges={['top']}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Ionicons name="chevron-back" size={24} color="#0A9D5C" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">Species Not Found</Text>
          <Text className="mt-2 text-gray-500 text-center">Unable to load species details. Please try again.</Text>
          <Pressable
            onPress={handleBackPress}
            className="mt-6 bg-[#0A9D5C] rounded-full px-6 py-3"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header - Back Button Only - Stays on screen when scrolling */}
      <View className="absolute top-0 left-0 z-20" style={{ zIndex: 20 }}>
        <SafeAreaView edges={['top']}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => [
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
              pressed && styles.pressed
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="#0A9D5C" />
          </Pressable>
        </SafeAreaView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header - Full width image that scrolls with content */}
        <View className="relative">
          {/* Full width image */}
          {currentAnt.image ? (
            <Image
              source={{ uri: currentAnt.image }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-[#e8f5e0] items-center justify-center">
              <MaterialCommunityIcons name="image" size={64} color="#328e6e" />
            </View>
          )}

          {/* Pagination Dots - only show if more than 1 image */}
          {currentAnt.image && (
            // For now we only have 1 image per ant, so don't show dots
            // When multiple images are added, this will show the correct number of dots
            null
          )}
        </View>

        {/* Content */}
        <View className="px-5 pt-5">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800 mb-1">{currentAnt.name}</Text>
          <Text className="text-gray-500 italic mb-3">{currentAnt.scientificName}</Text>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4">
            {currentAnt.tags.map((tag, index) => (
              <View key={index} className="bg-[#0A9D5C] rounded-full px-4 py-1.5 mr-2 mb-2">
                <Text className="text-sm text-white font-medium">{tag}</Text>
              </View>
            ))}
          </View>

          {/* About Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">About</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.about}</Text>
          </View>

          {/* Classification Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">Classification</Text>
            <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Family</Text>
                <Text className="text-gray-800 font-medium">{currentAnt.classification.family}</Text>
              </View>
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Subfamily</Text>
                <Text className="text-gray-800 font-medium">{currentAnt.classification.subfamily}</Text>
              </View>
              <View className="flex-row justify-between py-3 px-4">
                <Text className="text-gray-600">Genus</Text>
                <Text className="text-[#0A9D5C] font-medium italic">{currentAnt.classification.genus}</Text>
              </View>
            </View>
          </View>

          {/* Characteristics Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Characteristics</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.characteristics}</Text>
          </View>

          {/* Color Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Color</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.colors.map((color, index) => (
                <FilterChip
                  key={index}
                  label={color}
                  onPress={() => { }}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Habitat Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Habitat</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.habitat.map((hab, index) => (
                <FilterChip
                  key={index}
                  label={hab}
                  onPress={() => { }}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Distribution in Thailand Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Distribution in Thailand</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.distribution.map((dist, index) => (
                <FilterChip
                  key={index}
                  label={dist}
                  onPress={() => { }}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {/* Behavior Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Behavior</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.behavior}</Text>
          </View>

          {/* Ecological Role Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Ecological Role</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.ecologicalRole}</Text>
          </View>

          {/* Contribute Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">Contribute</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Help improve our database</Text>
              <Pressable
                className="flex-row items-center border border-[#0A9D5C] rounded-full px-4 py-2"
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Ionicons name="pencil" size={16} color="#0A9D5C" />
                <Text className="text-[#0A9D5C] font-medium ml-2">Suggest Update</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Add space for bottom buttons */}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Fixed Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <SafeAreaView edges={['bottom']}>
          <View className="flex-row px-4 py-3 gap-3">
            <Pressable
              className="flex-1 bg-[#0A9D5C] rounded-full py-4 flex-row items-center justify-center"
              style={({ pressed }) => [
                {
                  shadowColor: '#0A9D5C',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                },
                pressed && styles.pressed
              ]}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text className="text-white font-semibold ml-2">Add to My Collection</Text>
            </Pressable>

            <Pressable
              className="bg-white border-2 border-[#0A9D5C] rounded-full px-6 py-4 items-center justify-center"
              onPress={() => router.push("/chatbot")}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text className="text-[#0A9D5C] font-semibold">Ask Chat</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
})
