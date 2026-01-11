"use client"

import {
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

// Define the type for route params
type DetailParams = {
  id: string
}

// Define the type for ant data
type AntData = {
  id: string
  name: string
  scientificName: string
  classification: {
    family: string
    subfamily: string
    genus: string
  }
  tags: string[]
  about: string
  characteristics: string
  colors: string[]
  habitat: string[]
  distribution: string[]
  behavior: string
  ecologicalRole: string
  image: string
}

// Sample ant data with images from database (mock data)
const antData: AntData[] = [
  {
    id: "1",
    name: "Yellow Crazy Ant",
    scientificName: "Anoplolepis gracilipes",
    classification: {
      family: "Formicidae",
      subfamily: "Formicidae",
      genus: "Anoplolepis",
    },
    tags: ["Tags", "Tags"],
    about: "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    characteristics: "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    colors: ["Tags", "Tags"],
    habitat: ["Tags", "Tags"],
    distribution: ["Tags", "Tags"],
    behavior: "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    ecologicalRole: "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg",
  },
  {
    id: "2",
    name: "Carpenter Ant",
    scientificName: "Camponotus pennsylvanicus",
    classification: {
      family: "Formicidae",
      subfamily: "Formicinae",
      genus: "Camponotus",
    },
    tags: ["Destructive", "Large"],
    about: "Carpenter ants are large ants that are commonly found in wooded areas and wooden structures. They excavate wood to build nests but don't eat the wood.",
    characteristics: "Large black ants, 6-13mm in size. Workers have large mandibles and a smooth, rounded thorax. They are polymorphic with major and minor workers.",
    colors: ["Black", "Dark Brown"],
    habitat: ["Forests", "Buildings"],
    distribution: ["North America", "Europe"],
    behavior: "Unlike termites, carpenter ants don't eat wood but excavate it to build nests. They are primarily nocturnal and feed on insects and honeydew.",
    ecologicalRole: "Important decomposers that help break down dead wood in forest ecosystems.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Carpenter_ant_Tanzania_crop.jpg",
  },
  {
    id: "3",
    name: "Fire Ant",
    scientificName: "Solenopsis invicta",
    classification: {
      family: "Formicidae",
      subfamily: "Myrmicinae",
      genus: "Solenopsis",
    },
    tags: ["Dangerous", "Common"],
    about: "Fire ants are aggressive stinging ants known for their painful stings and large mound nests. They are considered invasive in many regions.",
    characteristics: "Small to medium sized ants, 2-6mm. Reddish-brown color with darker abdomen. They have a visible stinger and two-segmented waist.",
    colors: ["Red", "Brown"],
    habitat: ["Lawns", "Fields"],
    distribution: ["South America", "USA", "Australia"],
    behavior: "Aggressive when disturbed, fire ants will swarm and sting repeatedly. They are omnivorous and feed on plants and other insects.",
    ecologicalRole: "Predators of many small insects and arthropods. Can be beneficial for pest control but also disruptive to native ecosystems.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxO4D319sBerXRBC58SSvMjWm5SHZEbV2iF7siCvIUqEPyu_DOc_c7GJSNoRoZ7FMj77nL1Hit4D0P9Oeympiaw",
  },
]

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>()
  const { id } = params

  // Find the ant by ID or use the first one as default - always use database image
  const currentAnt = antData.find((ant) => ant.id === id) || antData[0]

  const handleBackPress = () => {
    router.back()
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

          {/* Pagination Dots - overlaid on image */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${index === 0 ? "bg-[#0A9D5C]" : "bg-white/60"}`}
              />
            ))}
          </View>
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
                <View key={index} className="bg-[#e8f5e0] rounded-full px-4 py-1.5 mr-2 mb-2">
                  <Text className="text-[#0A9D5C] font-medium text-sm">{color}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Habitat Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Habitat</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.habitat.map((hab, index) => (
                <View key={index} className="bg-[#e8f5e0] rounded-full px-4 py-1.5 mr-2 mb-2">
                  <Text className="text-[#0A9D5C] font-medium text-sm">{hab}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Distribution in Thailand Section */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Distribution in Thailand</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.distribution.map((dist, index) => (
                <View key={index} className="bg-[#e8f5e0] rounded-full px-4 py-1.5 mr-2 mb-2">
                  <Text className="text-[#0A9D5C] font-medium text-sm">{dist}</Text>
                </View>
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
