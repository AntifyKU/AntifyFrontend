"use client"

import { useState } from "react"
import {
    View,
    Text,
    Pressable,
    TextInput,
    ScrollView,
    StatusBar,
    Image,
    StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

// Define the type for route params
type HelpImproveParams = {
    imageUri?: string
    antId?: string
    antName?: string
    scientificName?: string
    matchPercentage?: string
    source?: string
}

// Sample species list for "No, Incorrect" selection
type SpeciesItem = {
    id: string
    name: string
    description: string
}

const speciesList: SpeciesItem[] = [
    { id: "1", name: "Worem ipsum", description: "Morem ipsum dolor sit amet," },
    { id: "2", name: "Worem ipsum", description: "Morem ipsum dolor sit amet," },
    { id: "3", name: "Worem ipsum", description: "Morem ipsum dolor sit amet," },
    { id: "4", name: "Worem ipsum", description: "Morem ipsum dolor sit amet," },
]

export default function HelpImproveAIScreen() {
    const params = useLocalSearchParams<HelpImproveParams>()
    const { imageUri, antId, antName, scientificName, matchPercentage, source } = params

    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null)
    const [rating, setRating] = useState<number>(0)
    const [additionalNotes, setAdditionalNotes] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")

    const handleBackPress = () => {
        router.back()
    }

    const handleSubmitFeedback = () => {
        // Collect feedback data
        const feedbackData = {
            isCorrect,
            selectedSpeciesId: isCorrect === false ? selectedSpeciesId : null,
            rating,
            additionalNotes,
            antId,
            antName,
            scientificName,
            imageUri,
            source,
        }

        console.log("Feedback submitted:", feedbackData)

        // Navigate to detail page after submitting feedback
        router.push({
            pathname: '/detail/[id]',
            params: { id: antId || "1", imageUri, source }
        })
    }

    const handleCorrectPress = () => {
        setIsCorrect(true)
        setSelectedSpeciesId(null)
    }

    const handleIncorrectPress = () => {
        setIsCorrect(false)
    }

    const handleSpeciesSelect = (speciesId: string) => {
        setSelectedSpeciesId(speciesId)
    }

    // Filter species based on search query
    const filteredSpecies = speciesList.filter(species =>
        species.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView edges={['top']}>
                <View className="flex-row items-center px-4 py-3">
                    <Pressable
                        onPress={handleBackPress}
                        className="p-2"
                        style={({ pressed }) => pressed && styles.pressed}
                    >
                        <Ionicons name="chevron-back" size={28} color="#0A9D5C" />
                    </Pressable>
                    <Text className="flex-1 text-center text-xl font-bold text-gray-800 mr-10">
                        Help Improve AI
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Ant Card Preview */}
                <View className="mx-4 mt-4 bg-[#e8f5e0] rounded-xl p-3 flex-row items-center">
                    {/* Thumbnail */}
                    <View className="w-20 h-20 rounded-lg bg-[#d4e8c7] items-center justify-center mr-3 overflow-hidden">
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <MaterialCommunityIcons name="image" size={32} color="#328e6e" />
                        )}
                    </View>

                    {/* Details */}
                    <View className="flex-1">
                        <Text className="font-bold text-gray-800 text-lg">{antName || "Worem ipsum"}</Text>
                        <Text className="text-gray-500 text-sm">{scientificName || "Morem ipsum dolor sit amet,"}</Text>
                        <Text className="text-[#0A9D5C] font-semibold">{matchPercentage || "80"}% Match</Text>
                    </View>
                </View>

                {/* Was this identification correct? */}
                <View className="mx-4 mt-8">
                    <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                        Was this identification correct?
                    </Text>
                    <Text className="text-gray-500 text-center mb-6">
                        Your feedback helps train our AI to be more accurate
                    </Text>

                    {/* Yes/No Buttons */}
                    <View className="flex-row justify-center gap-4">
                        <Pressable
                            className={`flex-1 py-4 rounded-xl items-center border-2 ${isCorrect === true
                                ? 'bg-[#0A9D5C] border-[#0A9D5C]'
                                : 'bg-white border-gray-200'
                                }`}
                            onPress={handleCorrectPress}
                            style={({ pressed }) => pressed && styles.pressed}
                        >
                            <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isCorrect === true ? 'bg-white/20' : 'bg-[#e8f5e0]'
                                }`}>
                                <Ionicons
                                    name="thumbs-up"
                                    size={24}
                                    color={isCorrect === true ? "#fff" : "#0A9D5C"}
                                />
                            </View>
                            <Text className={`font-semibold ${isCorrect === true ? 'text-white' : 'text-[#0A9D5C]'
                                }`}>
                                Yes, Correct
                            </Text>
                        </Pressable>

                        <Pressable
                            className={`flex-1 py-4 rounded-xl items-center border-2 ${isCorrect === false
                                ? 'bg-[#EF4444] border-[#EF4444]'
                                : 'bg-white border-gray-200'
                                }`}
                            onPress={handleIncorrectPress}
                            style={({ pressed }) => pressed && styles.pressed}
                        >
                            <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isCorrect === false ? 'bg-white/20' : 'bg-[#FEE2E2]'
                                }`}>
                                <Ionicons
                                    name="thumbs-down"
                                    size={24}
                                    color={isCorrect === false ? "#fff" : "#EF4444"}
                                />
                            </View>
                            <Text className={`font-semibold ${isCorrect === false ? 'text-white' : 'text-[#EF4444]'
                                }`}>
                                No, Incorrect
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Species Selection (only shown when "No, Incorrect" is selected) */}
                {isCorrect === false && (
                    <View className="mx-4 mt-6">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Select the correct species:
                        </Text>

                        {/* Search Input */}
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
                            <Ionicons name="search" size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700"
                                placeholder="Search species..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Species not in list option */}
                        <Pressable
                            className={`flex-row items-center p-3 mb-2 rounded-xl border ${selectedSpeciesId === 'not-in-list'
                                ? 'border-[#0A9D5C] bg-[#e8f5e0]'
                                : 'border-gray-200'
                                }`}
                            onPress={() => handleSpeciesSelect('not-in-list')}
                            style={({ pressed }) => pressed && styles.pressed}
                        >
                            <Text className="text-gray-600">Species not in list</Text>
                        </Pressable>

                        {/* Species List */}
                        {filteredSpecies.map((species) => (
                            <Pressable
                                key={species.id}
                                className={`flex-row items-center p-3 mb-2 rounded-xl border ${selectedSpeciesId === species.id
                                    ? 'border-[#0A9D5C] bg-[#e8f5e0]'
                                    : 'border-gray-200'
                                    }`}
                                onPress={() => handleSpeciesSelect(species.id)}
                                style={({ pressed }) => pressed && styles.pressed}
                            >
                                {/* Thumbnail */}
                                <View className="w-12 h-12 rounded-lg bg-[#d4e8c7] items-center justify-center mr-3">
                                    <MaterialCommunityIcons name="image" size={20} color="#328e6e" />
                                </View>

                                {/* Details */}
                                <View className="flex-1">
                                    <Text className="font-bold text-gray-800">{species.name}</Text>
                                    <Text className="text-gray-500 text-sm">{species.description}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Rate prediction quality */}
                <View className="mx-4 mt-6">
                    <Text className="text-lg font-bold text-gray-800 mb-3">
                        Rate this prediction quality:
                    </Text>
                    <View className="flex-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable
                                key={star}
                                onPress={() => setRating(star)}
                                className="mr-2"
                                style={({ pressed }) => pressed && styles.pressed}
                            >
                                <Ionicons
                                    name={rating >= star ? "star" : "star-outline"}
                                    size={36}
                                    color={rating >= star ? "#FFB800" : "#d4d6dd"}
                                />
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Additional Notes */}
                <View className="mx-4 mt-6">
                    <Text className="text-lg font-bold text-gray-800 mb-3">
                        Additional notes (optional):
                    </Text>
                    <TextInput
                        className="h-28 p-4 text-gray-700 border border-gray-200 rounded-xl bg-white"
                        placeholder="Describe what helped you identify this ant, or what the AI got wrong..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        textAlignVertical="top"
                        value={additionalNotes}
                        onChangeText={setAdditionalNotes}
                    />
                </View>

                {/* Submit Button */}
                <View className="mx-4 mt-8 mb-4">
                    <Pressable
                        className="bg-[#0A9D5C] rounded-full py-4 flex-row items-center justify-center"
                        onPress={handleSubmitFeedback}
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
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text className="ml-2 text-white font-semibold text-base">Submit Feedback</Text>
                    </Pressable>
                </View>

                {/* Footer Note */}
                <View className="mx-4 mb-8">
                    <Text className="text-center text-gray-400 text-sm">
                        Your feedback is anonymous and used solely to improve species identification accuracy.
                    </Text>
                </View>

                {/* Bottom Padding */}
                <View className="h-8" />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.7,
    },
})
