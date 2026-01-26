import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { identificationResultsData, antSpeciesData } from "@/constants/AntData";
import { useIdentification } from "@/hooks/useIdentification";
import { useSpecies } from "@/hooks/useSpecies";
import AntCard from "@/components/AntCard";
import PrimaryButton from "@/components/atom/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

// Define the type for route params
type IdentificationParams = {
  imageUri?: string;
  source?: string; // 'camera', 'gallery'
};

// Helper to find species info from API or static data
function findSpeciesInfo(
  classNames: string[],
  allSpecies: typeof antSpeciesData,
) {
  return classNames.map((className, index) => {
    // Try to match by name (case insensitive)
    const found = allSpecies.find(
      (s) =>
        s.name.toLowerCase().includes(className.toLowerCase()) ||
        s.scientificName.toLowerCase().includes(className.toLowerCase()) ||
        className.toLowerCase().includes(s.name.toLowerCase()),
    );

    if (found) {
      return {
        id: found.id,
        name: found.name,
        scientificName: found.scientificName,
        image: found.image,
        matchPercentage: 0, // Will be overwritten
      };
    }

    // Fallback to using the class name as display
    return {
      id: `unknown-${index}`,
      name: className.replace(/_/g, " "),
      scientificName: className,
      image: "",
      matchPercentage: 0,
    };
  });
}

export default function IdentificationResultsScreen() {
  const params = useLocalSearchParams<IdentificationParams>();
  const { imageUri, source } = params;

  // Use the identification hook
  const {
    classificationResult,
    loading: identifyLoading,
    error: identifyError,
    identifyImage,
  } = useIdentification();

  // Get species list for matching predictions to species info
  const { species: speciesList } = useSpecies();

  // State for processed results
  const [hasIdentified, setHasIdentified] = useState(false);

  // Trigger identification when image is available
  useEffect(() => {
    if (imageUri && !hasIdentified && !identifyLoading) {
      setHasIdentified(true);
      identifyImage(imageUri);
    }
  }, [imageUri, hasIdentified, identifyLoading, identifyImage]);

  // Process identification results
  const { bestMatch, otherMatches, totalMatches, isUsingFallback } =
    useMemo(() => {
      // If we have API results, use them
      if (
        classificationResult?.success &&
        classificationResult.top5_predictions?.length > 0
      ) {
        const predictions = classificationResult.top5_predictions;

        // Map predictions to species info - use static data for species lookup
        const allSpecies = antSpeciesData;
        const classNames = predictions.map((p) => p.class_name);
        const speciesInfoList = findSpeciesInfo(classNames, allSpecies);

        // Add confidence percentages
        const matchesWithConfidence = speciesInfoList.map((info, index) => ({
          ...info,
          matchPercentage: Math.round(predictions[index].confidence * 100),
        }));

        return {
          bestMatch: matchesWithConfidence[0],
          otherMatches: matchesWithConfidence.slice(1),
          totalMatches: matchesWithConfidence.length,
          isUsingFallback: false,
        };
      }

      // Fallback to static mock data
      return {
        bestMatch: identificationResultsData[0],
        otherMatches: identificationResultsData.slice(1),
        totalMatches: identificationResultsData.length,
        isUsingFallback: true,
      };
    }, [classificationResult]);

  const handleBackPress = () => {
    // TODO: change that user already give the feedback or not if not redirect to feedback page
    router.back();
  };

  const handleConfirmAndViewDetails = (antId: string) => {
    // Navigate to help-improve-ai page first before going to detail
    router.push({
      pathname: "/help-improve-ai",
      params: {
        antId: antId,
        imageUri,
        source,
        antName: bestMatch.name,
        scientificName: bestMatch.scientificName,
        matchPercentage: bestMatch.matchPercentage?.toString(),
      },
    });
  };

  const handleProvideFeedback = () => {
    router.push({
      pathname: "/feedback",
      params: {
        imageUri: imageUri,
        antName: bestMatch.name,
        scientificName: bestMatch.scientificName,
        source: source,
      },
    });
  };

  const handleIdentifyAnother = () => {
    router.dismissAll();
    router.replace("/(tabs)/index-home");
    // TODO: navigate to camera or gallery based on 'source' param
  };

  const handleOtherMatchPress = (ant: {
    id: string;
    name: string;
    scientificName: string;
    image: string;
    matchPercentage: number;
  }) => {
    router.push({
      pathname: "/detail/[id]",
      params: { id: ant.id, imageUri: ant.image, source: "result" },
    });
  };

  // Show loading state while identifying
  if (identifyLoading) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1">
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-6 text-xl font-bold text-gray-800 text-center">
              Analyzing Image...
            </Text>
            <Text className="mt-2 text-gray-500 text-center">
              Our AI is identifying the ant species in your photo
            </Text>
            {imageUri && (
              <View className="mt-8 w-48 h-48 rounded-xl overflow-hidden">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Show error state if identification failed and no fallback
  if (identifyError && !bestMatch) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View className="flex-row items-center px-4 py-2">
            <TouchableOpacity onPress={handleBackPress} className="p-2">
              <Ionicons name="chevron-back" size={28} color="#0A9D5C" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-gray-800 mr-10">
              Identification Failed
            </Text>
          </View>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color="#EF4444"
          />
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
            Unable to Identify
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            We couldn&#39;t identify the ant in this image. Please try again
            with a clearer photo.
          </Text>
          <PrimaryButton
            title="Try Again"
            icon="camera-outline"
            onPress={handleIdentifyAnother}
            size="large"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView>
        <View className="pt-4 pb-5">
          <ScreenHeader
            title="Identification Results"
            leftIcon="chevron-back"
            onLeftPress={handleBackPress}
          />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Analysis Complete Banner */}
        <View className="mx-4 mt-4 bg-[#e8f5e0] rounded-xl p-4 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
            <Ionicons name="checkmark-circle" size={28} color="#0A9D5C" />
          </View>
          <View>
            <Text className="text-[#0A9D5C] font-bold text-lg">
              Analysis Complete
            </Text>
            <Text className="text-[#0A9D5C] text-sm">
              {totalMatches} possible matches found
            </Text>
          </View>
        </View>

        {/* Best Match Section */}
        <View className="mx-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Best Match
          </Text>

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
                  <MaterialCommunityIcons
                    name="image"
                    size={48}
                    color="#328e6e"
                  />
                </View>
              )}
            </View>

            {/* Best Match Details */}
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-800">
                {bestMatch.name}
              </Text>
              <Text className="text-gray-500 text-sm italic">
                {bestMatch.scientificName}
              </Text>
              <Text className="text-[#0A9D5C] font-semibold mt-1">
                {bestMatch.matchPercentage}% Match
              </Text>

              {/* Confirm Button */}
              <TouchableOpacity
                className="mt-4 py-3 rounded-full border-2 border-[#0A9D5C] items-center"
                onPress={() => handleConfirmAndViewDetails(bestMatch.id)}
              >
                <Text className="text-[#0A9D5C] font-semibold">
                  Confirm & View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Help Improve AI Section */}
        <View className="mx-4 mt-6">
          <Text className="text-center text-gray-600 mb-3">
            Help improve our AI accuracy
          </Text>

          <TouchableOpacity
            className="py-3 rounded-full border border-gray-300 flex-row items-center justify-center"
            onPress={handleProvideFeedback}
          >
            <Ionicons name="thumbs-up-outline" size={20} color="#0A9D5C" />
            <Text className="text-[#0A9D5C] font-semibold ml-2">
              Provide Feedback
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other Possibilities Section */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Other Possibilities
          </Text>

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
        <SafeAreaView edges={["bottom"]}>
          <PrimaryButton
            title="Identify Another Ant"
            icon="camera-outline"
            onPress={handleIdentifyAnother}
            size="large"
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
