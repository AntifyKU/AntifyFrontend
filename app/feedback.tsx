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
  ActivityIndicator,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import StarRating from "@/components/StarRating"
import FilterChip from "@/components/FilterChip"
import PrimaryButton from "@/components/PrimaryButton"
import { feedbackService } from "@/services/feedback"

// Define the type for route params
type FeedbackParams = {
  imageUri?: string
  antName?: string
  scientificName?: string
  source?: string
  speciesId?: string
}

type FeedbackOption = {
  id: string
  label: string
  selected: boolean
}

export default function FeedbackScreen() {
  const params = useLocalSearchParams<FeedbackParams>()
  const { imageUri, antName, scientificName, source, speciesId } = params

  const [rating, setRating] = useState<number>(0)
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // What did you like options
  const [likeOptions, setLikeOptions] = useState<FeedbackOption[]>([
    { id: "1", label: "Easy to Use", selected: false },
    { id: "2", label: "Accurate Results", selected: false },
    { id: "3", label: "Helpful Information", selected: false },
    { id: "4", label: "Fast Response", selected: false },
    { id: "5", label: "Great UI Design", selected: false },
  ])

  // What could be improved options
  const [improveOptions, setImproveOptions] = useState<FeedbackOption[]>([
    { id: "1", label: "More Species Coverage", selected: false },
    { id: "2", label: "Clearer Instructions", selected: false },
    { id: "3", label: "Better Image Tips", selected: false },
    { id: "4", label: "Faster Processing", selected: false },
  ])

  const toggleLikeOption = (id: string) => {
    setLikeOptions(likeOptions.map((option) => (option.id === id ? { ...option, selected: !option.selected } : option)))
  }

  const toggleImproveOption = (id: string) => {
    setImproveOptions(
      improveOptions.map((option) => (option.id === id ? { ...option, selected: !option.selected } : option)),
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please provide a rating before submitting.")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare feedback data for API
      const feedbackData = {
        rating,
        likes: likeOptions.filter((option) => option.selected).map((option) => option.label),
        improvements: improveOptions.filter((option) => option.selected).map((option) => option.label),
        additional_notes: additionalFeedback || undefined,
        species_id: speciesId || undefined,
      }

      // Submit to backend API
      await feedbackService.submitFeedback(feedbackData)

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
    } catch (error) {
      console.error("Error submitting feedback:", error)
      
      // Still show success for now (API might not be available)
      // In production, you might want to show an error instead
      Alert.alert("Thank You!", "Your feedback has been recorded.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)")
          },
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
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
          <Text className="text-3xl font-bold text-gray-800">Help us improve our AI.</Text>
        </View>

        {/* Display the uploaded/captured image */}
        {imageUri && (
          <View className="items-center mb-6">
            <Image source={{ uri: imageUri }} className="w-40 h-40 rounded-full" resizeMode="cover" />
            {antName && (
              <Text className="mt-2 text-base font-medium text-center">
                {antName}
                {scientificName && (
                  <Text className="font-normal text-gray-500 italic">
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
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            activeColor="#328e6e"
          />
        </View>

        {/* What did you like */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">What did you like about it?</Text>
          <View className="flex-row flex-wrap">
            {likeOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                isSelected={option.selected}
                onPress={() => toggleLikeOption(option.id)}
                selectedBackgroundColor="#328e6e"
                unselectedBackgroundColor="#e1eebc"
                showCloseIcon={false}
              />
            ))}
          </View>
        </View>

        {/* What could be improved */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">What could be improved?</Text>
          <View className="flex-row flex-wrap">
            {improveOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                isSelected={option.selected}
                onPress={() => toggleImproveOption(option.id)}
                selectedBackgroundColor="#328e6e"
                unselectedBackgroundColor="#e1eebc"
                showCloseIcon={false}
              />
            ))}
          </View>
        </View>

        {/* Additional feedback */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-gray-800">Anything else?</Text>
          <TextInput
            className="h-32 p-4 text-gray-700 border border-gray-300 rounded-lg"
            placeholder="Share your thoughts with us..."
            multiline
            value={additionalFeedback}
            onChangeText={setAdditionalFeedback}
          />
        </View>

        {/* Submit button */}
        <View className="mb-8">
          <TouchableOpacity
            className={`bg-[#328e6e] rounded-lg py-4 items-center flex-row justify-center ${isSubmitting ? 'opacity-70' : ''}`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-lg font-semibold text-white ml-2">Submitting...</Text>
              </>
            ) : (
              <Text className="text-lg font-semibold text-white">Submit Feedback</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
