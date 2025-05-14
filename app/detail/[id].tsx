"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Animated,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

// Define the type for route params
type DetailParams = {
  id: string
  imageUri?: string
  source?: string // 'camera', 'gallery', or undefined (from collection)
}

// Define the type for ant data
type AntData = {
  id: string
  name: string
  scientificName: string
  genus: string
  accuracy: string
  image: string
  habitat: string
  behavior: string
  tags: string[]
  isFoundInYourLocation?: boolean // Added property
  isPoisonous?: boolean // Added property
  matchDetails: {
    shape: string
    color: string
    pattern: string
  }
}

// Get screen dimensions
const { width } = Dimensions.get("window")

// Sample ant data with images and accuracy
const antData: AntData[] = [
  {
    id: "3",
    name: "Fire Ant",
    scientificName: "Solenopsis invicta",
    genus: "Solenopsis",
    accuracy: "96%",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxO4D319sBerXRBC58SSvMjWm5SHZEbV2iF7siCvIUqEPyu_DOc_c7GJSNoRoZ7FMj77nL1Hit4D0P9Oeympiaw",
    habitat:
      "Fire ants build mounds in open areas such as lawns, fields, and pastures. They prefer sunny locations and can be found in many soil types.",
    behavior:
      "Aggressive when disturbed, fire ants will swarm and sting repeatedly. They are omnivorous and feed on plants and other insects.",
    tags: ["Dangerous", "Common"],
    isPoisonous: true, // Marked as poisonous
    isFoundInYourLocation: true, // Found in user's location
    matchDetails: {
      shape: "98%",
      color: "99%",
      pattern: "100%",
    },
  },
  {
    id: "2",
    name: "Carpenter Ant",
    scientificName: "Camponotus pennsylvanicus",
    genus: "Camponotus",
    accuracy: "95%",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Carpenter_ant_Tanzania_crop.jpg",
    habitat:
      "Carpenter ants nest in wood, creating galleries and tunnels. They're commonly found in forests, wooded areas, and wooden structures.",
    behavior:
      "Unlike termites, carpenter ants don't eat wood but excavate it to build nests. They are primarily nocturnal and feed on insects and honeydew.",
    tags: ["Destructive", "Large"],
    isFoundInYourLocation: true, // Found in user's location
    matchDetails: {
      shape: "96%",
      color: "94%",
      pattern: "95%",
    },
  },
  {
    id: "5",
    name: "Harvester Ant",
    scientificName: "Pogonomyrmex barbatus",
    genus: "Pogonomyrmex",
    accuracy: "92%",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Florida_harvester_ant_teamwork%21_%28Pogonomyrmex_badius%29_%286502194585%29.jpg",
    habitat:
      "Harvester ants live in dry, open habitats like deserts and grasslands. They build large, circular nest mounds with a cleared area around them.",
    behavior:
      "These ants collect and store seeds as their primary food source. They have a powerful sting and are active during the day.",
    tags: ["Seed Collector", "Desert"],
    isPoisonous: true, // Marked as poisonous
    matchDetails: {
      shape: "93%",
      color: "90%",
      pattern: "94%",
    },
  },
  {
    id: "4",
    name: "Bullet Ant",
    scientificName: "Paraponera clavata",
    genus: "Paraponera",
    accuracy: "88%",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Paraponera_clavata.jpg/500px-Paraponera_clavata.jpg",
    habitat: "Bullet ants inhabit rainforests in Central and South America, nesting at the base of trees.",
    behavior:
      "Known for having one of the most painful stings in the insect world, bullet ants are predatory and forage in trees for small arthropods and nectar.",
    tags: ["Painful Sting", "Tropical"],
    isPoisonous: true, // Marked as poisonous
    matchDetails: {
      shape: "89%",
      color: "87%",
      pattern: "90%",
    },
  },
  {
    id: "1",
    name: "Weaver Ant",
    scientificName: "Oecophylla smaragdina",
    genus: "Oecophylla",
    accuracy: "85%",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg",
    habitat:
      "Weaver ants are found in tropical forests of Asia and Australia, building nests by weaving leaves together with silk produced by their larvae.",
    behavior:
      "These ants are highly territorial and aggressive. They use their strong mandibles to defend their territory and can spray formic acid when threatened.",
    tags: ["Territorial", "Arboreal"],
    matchDetails: {
      shape: "86%",
      color: "84%",
      pattern: "87%",
    },
  },
  // Add a default ant for new identifications
  {
    id: "new",
    name: "Unknown Ant",
    scientificName: "Species pending identification",
    genus: "Unknown",
    accuracy: "85%",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg", // Default image
    habitat: "Habitat information will be provided after identification.",
    behavior: "Behavior information will be provided after identification.",
    tags: ["Unidentified"],
    matchDetails: {
      shape: "85%",
      color: "85%",
      pattern: "85%",
    },
  },
]

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>()
  const { id, imageUri, source } = params

  console.log("Detail screen params:", { id, imageUri, source }) // Debug log

  // Determine if this is from a photo (camera/gallery) or from collection
  const isFromPhoto = source === "camera" || source === "gallery"

  // Find the ant by ID or use the first one as default
  const selectedAnt = antData.find((ant) => ant.id === id) || antData[0]

  const [activeSlide, setActiveSlide] = useState<number>(0)
  const [currentAnt, setCurrentAnt] = useState<AntData>(selectedAnt)

  // Prepare the ants array based on the source
  // If from photo, add the identified ant first with 100% accuracy, then show similar ants
  // If from collection, just show the selected ant
  const ants = isFromPhoto
    ? [
        {
          ...selectedAnt,
          id: "0",
          accuracy: "100%",
          image: imageUri || selectedAnt.image,
          matchDetails: {
            shape: "98%",
            color: "99%",
            pattern: "100%",
          },
        },
        ...antData.filter((ant) => ant.id !== id).slice(0, 3), // Show only 3 similar ants
      ]
    : [selectedAnt]

  const flatListRef = useRef<FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  // Update current ant when active slide changes
  useEffect(() => {
    if (activeSlide < ants.length) {
      setCurrentAnt(ants[activeSlide])
    }
  }, [activeSlide])

  const handleBackPress = () => {
    // Go back to previous screen
    router.back()
  }

  const handleFeedbackPress = () => {
    // Only pass the uploaded/captured image to the feedback screen
    // If we're viewing the first slide (user's photo) and it's from camera/gallery
    if (isFromPhoto && activeSlide === 0 && imageUri) {
      router.push({
        pathname: "/feedback",
        params: {
          imageUri: imageUri,
          antName: currentAnt.name,
          scientificName: currentAnt.scientificName,
          source: source,
        },
      })
    } else {
      // If we're not viewing the user's photo, don't allow feedback
      // This is a fallback, as the button should only be shown for appropriate ants
      router.push("/feedback")
    }
  }

  // FIXED: Always show feedback button for uploaded photos on the first slide
  // For photos from camera/gallery, we always want to show the feedback button
  // when viewing the first slide (the user's uploaded/captured image)
  const shouldShowFeedbackButton = isFromPhoto && activeSlide === 0

  const renderImage = ({ item, index }: { item: AntData; index: number }) => {
    // Make ALL photos circular
    return (
      <View style={{ width, justifyContent: "center", alignItems: "center" }}>
        <Image source={{ uri: item.image }} className="rounded-full w-60 h-60" resizeMode="cover" />
      </View>
    )
  }

  interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        x: number
      }
    }
  }

  const handleScroll = (event: ScrollEvent) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex)
    }
  }

  return (
    <View className="flex-1 bg-[#f5f7e8]">
      <StatusBar barStyle="dark-content" />

      {/* Back Button - Positioned directly at the top without header */}
      <SafeAreaView>
        <TouchableOpacity className="p-4" onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View className="py-4">
          <FlatList
            ref={flatListRef}
            data={ants}
            renderItem={renderImage}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            decelerationRate="fast"
          />
        </View>

        {/* Pagination Dots - Only show if there are multiple images */}
        {ants.length > 1 && (
          <View className="flex-row justify-center mb-6">
            {ants.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActiveSlide(index)
                  flatListRef.current?.scrollToIndex({ index, animated: true })
                }}
              >
                <View
                  className={`h-2 w-2 rounded-full mx-1 ${index === activeSlide ? "bg-green-500" : "bg-gray-300"}`}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content */}
        <View className="px-5">
          {/* Title and Accuracy (only show accuracy if from photo) */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-3xl font-bold text-black">{currentAnt.name}</Text>

            {/* Accuracy Indicator - Only show if from photo */}
            {isFromPhoto && (
              <View className="bg-[#0A9D5C] rounded-full px-3 py-1 flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text className="ml-1 font-bold text-white">{currentAnt.accuracy}</Text>
              </View>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-600">Scientific name: {currentAnt.scientificName}</Text>
            <Text className="text-gray-600">Genus: {currentAnt.genus}</Text>
          </View>

          <View className="flex-row flex-wrap mb-4">
            {currentAnt.tags.map((tag, index) => (
              <View key={index} className="bg-[#0A9D5C] rounded-full px-4 py-1 mr-2 mb-2">
                <Text className="text-xs text-white uppercase">{tag}</Text>
              </View>
            ))}

            {/* Show location tag if found in user's location */}
            {currentAnt.isFoundInYourLocation && (
              <View className="bg-[#FF8C00] rounded-full px-4 py-1 mr-2 mb-2">
                <Text className="text-xs text-white uppercase">Found in your area</Text>
              </View>
            )}

            {/* Show poisonous tag if ant is poisonous */}
            {currentAnt.isPoisonous && (
              <View className="bg-[#FF3B30] rounded-full px-4 py-1 mr-2 mb-2">
                <Text className="text-xs text-white uppercase">Poisonous</Text>
              </View>
            )}
          </View>

          {/* Detailed Accuracy Section - Only show if from photo */}
          {isFromPhoto && (
            <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
              <Text className="mb-2 text-xl font-bold text-black">Identification Accuracy</Text>

              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-700">Confidence Level</Text>
                  <Text className="font-bold text-[#0A9D5C]">{currentAnt.accuracy}</Text>
                </View>
                <View className="h-2 overflow-hidden bg-gray-200 rounded-full">
                  <View
                    className="h-full bg-[#0A9D5C] rounded-full"
                    style={{ width: `${Number.parseFloat(currentAnt.accuracy)}%` }}
                  />
                </View>
              </View>

              <View className="flex-row flex-wrap">
                <View className="px-3 py-1 mb-2 mr-2 bg-gray-100 rounded-full">
                  <Text className="text-xs text-gray-700">Shape Match: {currentAnt.matchDetails.shape}</Text>
                </View>
                <View className="px-3 py-1 mb-2 mr-2 bg-gray-100 rounded-full">
                  <Text className="text-xs text-gray-700">Color Match: {currentAnt.matchDetails.color}</Text>
                </View>
                <View className="px-3 py-1 mb-2 mr-2 bg-gray-100 rounded-full">
                  <Text className="text-xs text-gray-700">Pattern Match: {currentAnt.matchDetails.pattern}</Text>
                </View>
              </View>
            </View>
          )}

          <View className="mb-4">
            <Text className="mb-1 text-xl font-bold text-black">Habitat</Text>
            <Text className="text-gray-600">{currentAnt.habitat}</Text>
          </View>

          <View className="mb-8">
            <Text className="mb-1 text-xl font-bold text-black">Behavior</Text>
            <Text className="text-gray-600">{currentAnt.behavior}</Text>
          </View>

          {/* Buttons */}
          <View className="mb-4">
            {/* Add to Collection Button */}
            <TouchableOpacity className="bg-[#0A9D5C] rounded-lg py-4 items-center mb-4">
              <View className="flex-row items-center">
                <Ionicons name="add" size={20} color="#fff" />
                <Text className="ml-2 font-medium text-white">Add to Collection</Text>
              </View>
            </TouchableOpacity>

            {/* Feedback and Chat Buttons */}
            <View className="flex-row">
              {/* Feedback Button - Only show if conditions are met */}
              {shouldShowFeedbackButton && (
                <TouchableOpacity
                  className="bg-[#328e6e] rounded-lg py-4 flex-1 items-center mr-2"
                  onPress={handleFeedbackPress}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={20} color="#fff" />
                    <Text className="ml-2 font-medium text-white">Feedback</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Chat Button - Always show, but adjust width based on feedback button visibility */}
              <TouchableOpacity
                className={`bg-[#0A9D5C] rounded-lg py-4 flex-1 items-center ${shouldShowFeedbackButton ? "ml-2" : ""}`}
                onPress={() => router.push("/chatbot")}
              >
                <View className="flex-row items-center">
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text className="ml-2 font-medium text-white">Chat with us</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add extra space at the bottom */}
        <View className="h-20" />
      </Animated.ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#0A9D5C] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/chatbot")}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}
