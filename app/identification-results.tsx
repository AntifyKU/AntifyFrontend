"use client"

import { useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { identificationResultsData } from "@/constants/AntData"
import AntCard from "@/components/AntCard"
import PrimaryButton from "@/components/PrimaryButton"

// Define the type for route params
type IdentificationParams = {
    imageUri?: string
    source?: string // 'camera', 'gallery'
}

export default function IdentificationResultsScreen() {
    const params = useLocalSearchParams<IdentificationParams>()
    const { imageUri, source } = params

    const [bestMatch] = useState(identificationResultsData[0])
    const [otherMatches] = useState(identificationResultsData.slice(1))
    const totalMatches = identificationResultsData.length

    const handleBackPress = () => {
        router.back()
    }

    const handleConfirmAndViewDetails = (antId: string) => {
        // Navigate to help-improve-ai page first before going to detail
        router.push({
            pathname: '/help-improve-ai',
            params: {
                antId: antId,
                imageUri,
                source,
                antName: bestMatch.name,
                scientificName: bestMatch.scientificName,
                matchPercentage: bestMatch.matchPercentage?.toString()
            }
        })
    }

    const handleProvideFeedback = () => {
        router.push({
            pathname: "/feedback",
            params: {
                imageUri: imageUri,
                antName: bestMatch.name,
                scientificName: bestMatch.scientificName,
                source: source,
            },
        })
    }

    const handleIdentifyAnother = () => {
        router.dismissAll()
        router.replace('/(tabs)/index-home')
    }

    const handleOtherMatchPress = (ant: typeof identificationResultsData[0]) => {
        router.push({
            pathname: '/detail/[id]',
            params: { id: ant.id, imageUri: ant.image, source: 'result' }
        })
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView>
                <View className="flex-row items-center px-4 py-2">
                    <TouchableOpacity onPress={handleBackPress} className="p-2">
                        <Ionicons name="chevron-back" size={28} color="#0A9D5C" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-bold text-gray-800 mr-10">
                        Identification Results
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Analysis Complete Banner */}
                <View className="mx-4 mt-4 bg-[#e8f5e0] rounded-xl p-4 flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
                        <Ionicons name="checkmark-circle" size={28} color="#0A9D5C" />
                    </View>
                    <View>
                        <Text className="text-[#0A9D5C] font-bold text-lg">Analysis Complete</Text>
                        <Text className="text-[#0A9D5C] text-sm">{totalMatches} possible matches found</Text>
                    </View>
                </View>

                {/* Best Match Section */}
                <View className="mx-4 mt-6">
                    <Text className="text-xl font-bold text-gray-800 mb-3">Best Match</Text>

                    <View className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                        {/* Image Area with placeholder */}
                        <View className="h-40 bg-[#e8f5e0] items-center justify-center">
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="items-center justify-center">
                                    <MaterialCommunityIcons name="image" size={48} color="#328e6e" />
                                </View>
                            )}
                        </View>

                        {/* Best Match Details */}
                        <View className="p-4">
                            <Text className="text-lg font-bold text-gray-800">{bestMatch.name}</Text>
                            <Text className="text-gray-500 text-sm italic">{bestMatch.scientificName}</Text>
                            <Text className="text-[#0A9D5C] font-semibold mt-1">{bestMatch.matchPercentage}% Match</Text>

                            {/* Confirm Button */}
                            <TouchableOpacity
                                className="mt-4 py-3 rounded-full border-2 border-[#0A9D5C] items-center"
                                onPress={() => handleConfirmAndViewDetails(bestMatch.id)}
                            >
                                <Text className="text-[#0A9D5C] font-semibold">Confirm & View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Help Improve AI Section */}
                <View className="mx-4 mt-6">
                    <Text className="text-center text-gray-600 mb-3">Help improve our AI accuracy</Text>

                    <TouchableOpacity
                        className="py-3 rounded-full border border-gray-300 flex-row items-center justify-center"
                        onPress={handleProvideFeedback}
                    >
                        <Ionicons name="thumbs-up-outline" size={20} color="#0A9D5C" />
                        <Text className="text-[#0A9D5C] font-semibold ml-2">Provide Feedback</Text>
                    </TouchableOpacity>
                </View>

                {/* Other Possibilities Section */}
                <View className="mx-4 mt-6">
                    <Text className="text-lg font-bold text-gray-800 mb-3">Other Possibilities</Text>

                    {otherMatches.map((ant) => (
                        <AntCard
                            key={ant.id}
                            id={ant.id}
                            name={ant.name}
                            description={ant.scientificName}
                            matchPercentage={ant.matchPercentage}
                            image={ant.image}
                            variant="horizontal"
                            showMatchPercentage={true}
                            onPress={() => handleOtherMatchPress(ant)}
                        />
                    ))}
                </View>

                {/* Bottom Padding */}
                <View className="h-24" />
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
                <SafeAreaView edges={['bottom']}>
                    <PrimaryButton
                        title="Identify Another Ant"
                        icon="camera-outline"
                        onPress={handleIdentifyAnother}
                        size="large"
                    />
                </SafeAreaView>
            </View>
        </View>
    )
}
