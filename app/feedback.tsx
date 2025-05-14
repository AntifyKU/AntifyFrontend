"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

// Define the type for route params
type FeedbackParams = {
  imageUri?: string
  antName?: string
  scientificName?: string
  source?: string
}

type FeedbackOption = {
  id: string
  label: string
  selected: boolean
}

export default function FeedbackScreen() {
  const params = useLocalSearchParams<FeedbackParams>()
  const { imageUri, antName, scientificName, source } = params

  const [rating, setRating] = useState<number>(0)
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("")

  // What did you like options
  const [likeOptions, setLikeOptions] = useState<FeedbackOption[]>([
    { id: "1", label: "EASY TO USE", selected: false },
    { id: "2", label: "CORRECTNESS", selected: false },
    { id: "3", label: "HELPFUL", selected: false },
    { id: "4", label: "CONVENIENT", selected: false },
    { id: "5", label: "LOOKS GOOD", selected: false },
  ])

  // What could be improved options
  const [improveOptions, setImproveOptions] = useState<FeedbackOption[]>([
    { id: "1", label: "COULD HAVE MORE COMPONENTS", selected: false },
    { id: "2", label: "COMPLEX", selected: false },
    { id: "3", label: "NOT INTERACTIVE", selected: false },
    { id: "4", label: "NOT CORRECT", selected: false },
  ])

  const toggleLikeOption = (id: string) => {
    setLikeOptions(likeOptions.map((option) => (option.id === id ? { ...option, selected: !option.selected } : option)))
  }

  const toggleImproveOption = (id: string) => {
    setImproveOptions(
      improveOptions.map((option) => (option.id === id ? { ...option, selected: !option.selected } : option)),
    )
  }

  const handleSubmit = () => {
    // Here you would typically send the feedback data to your backend
    const feedbackData = {
      rating,
      likes: likeOptions.filter((option) => option.selected).map((option) => option.label),
      improvements: improveOptions.filter((option) => option.selected).map((option) => option.label),
      additionalFeedback,
      antName,
      scientificName,
      imageUri,
      source,
    }

    console.log("Feedback submitted:", feedbackData)

    // Show a thank you message
    Alert.alert("Thank You!", "Your feedback has been submitted successfully.", [
      {
        text: "OK",
        onPress: () => {
          // Navigate back to the explore page
          router.replace("/(tabs)")
        },
      },
    ])
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Custom header with back button */}
      <SafeAreaView className="border-b border-gray-200">
        <View className="relative flex-row items-center justify-center px-4 py-4">
          <TouchableOpacity className="absolute left-4" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#328e6e" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-center">Feedback</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-5">
        {/* Title */}
        <View className="mt-6 mb-4">
          <Text className="text-3xl font-bold text-gray-800">Help us improved our AI.</Text>
        </View>

        {/* Display the uploaded/captured image */}
        {imageUri && (
          <View className="items-center mb-6">
            <Image source={{ uri: imageUri }} className="w-40 h-40 rounded-full" resizeMode="cover" />
            {antName && (
              <Text className="mt-2 text-base font-medium text-center">
                {antName}
                {scientificName && (
                  <Text className="font-normal text-gray-500">
                    {"\n"}
                    {scientificName}
                  </Text>
                )}
              </Text>
            )}
          </View>
        )}

        {/* Rating */}
        <View className="mb-8">
          <Text className="mb-4 text-xl text-gray-600">How would you rate the result?</Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} className="mr-2">
                <Ionicons
                  name={rating >= star ? "star" : "star-outline"}
                  size={36}
                  color={rating >= star ? "#328e6e" : "#d4d6dd"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* What did you like */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">What did you like about it?</Text>
          <View className="flex-row flex-wrap">
            {likeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => toggleLikeOption(option.id)}
                className={`mr-2 mb-2 py-2 px-4 rounded-full ${option.selected ? "bg-[#328e6e]" : "bg-[#e1eebc]"}`}
              >
                <Text className={`${option.selected ? "text-white" : "text-gray-700"} font-medium`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* What could be improved */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">What could be improved?</Text>
          <View className="flex-row flex-wrap">
            {improveOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => toggleImproveOption(option.id)}
                className={`mr-2 mb-2 py-2 px-4 rounded-full ${option.selected ? "bg-[#328e6e]" : "bg-[#e1eebc]"}`}
              >
                <Text className={`${option.selected ? "text-white" : "text-gray-700"} font-medium`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional feedback */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">Anything else?</Text>
          <TextInput
            className="h-32 p-4 text-gray-700 border border-gray-300 rounded-lg"
            placeholder="Tell us everything."
            multiline
            value={additionalFeedback}
            onChangeText={setAdditionalFeedback}
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity className="bg-[#328e6e] rounded-lg py-4 items-center mb-8" onPress={handleSubmit}>
          <Text className="text-lg font-semibold text-white">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
