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
import { identificationResultsData } from "@/constants/AntData";
import { useIdentification } from "@/hooks/useIdentification";
import AntCard from "@/components/molecule/AntCard";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

// Define the type for route params
type IdentificationParams = {
  imageUri?: string;
  source?: string; // 'camera', 'gallery'
};

export default function IdentificationResultsScreen() {
  const params = useLocalSearchParams<IdentificationParams>();
  const { imageUri, source } = params;

  // Use the identification hook — now with species details
  const {
    speciesResult,
    speciesInfo,
    loading: identifyLoading,
    error: identifyError,
    identifySpecies,
  } = useIdentification();

  // State for processed results
  const [hasIdentified, setHasIdentified] = useState(false);

  // Trigger identification when image is available
  useEffect(() => {
    if (imageUri && !hasIdentified && !identifyLoading) {
      setHasIdentified(true);
      identifySpecies(imageUri);
    }
  }, [imageUri, hasIdentified, identifyLoading, identifySpecies]);

  // Process identification results
  const { bestMatch, otherMatches, totalMatches, isUsingFallback } =
    useMemo(() => {
      // If we have API results from the new species details endpoint
      if (speciesResult?.success && speciesResult.predictions?.length > 0) {
        const predictions = speciesResult.predictions;
        const info = speciesInfo;

        // Build best match from top prediction + Firestore info
        const bestPrediction = predictions[0];
        const bestMatchItem = {
          id: info?.id ?? `prediction-0`,
          name: info?.name ?? bestPrediction.class_name.replace(/_/g, " "),
          scientificName: info?.scientific_name ?? bestPrediction.class_name,
          image: info?.image ?? "",
          matchPercentage: Math.round(bestPrediction.confidence * 100),
        };

        // Other predictions (no Firestore lookup for these, just show class names)
        const otherMatchItems = predictions.slice(1).map((pred, index) => ({
          id: `prediction-${index + 1}`,
          name: pred.class_name.replace(/_/g, " "),
          scientificName: pred.class_name,
          image: "",
          matchPercentage: Math.round(pred.confidence * 100),
        }));

        return {
          bestMatch: bestMatchItem,
          otherMatches: otherMatchItems,
          totalMatches: predictions.length,
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
    }, [speciesResult, speciesInfo]);

  const handleBackPress = () => {
    // TODO: change that user already give the feedback or not if not redirect to feedback page
    router.back();
  };

  const handleConfirmAndViewDetails = (antId: string) => {
    // Navigate directly to detail page, feedback will be shown on back press
    router.push({
      pathname: "/detail/[id]",
      params: {
        id: antId,
        imageUri,
        source,
        fromIdentification: "true",
        antName: bestMatch.name,
        scientificName: bestMatch.scientificName,
        matchPercentage: bestMatch.matchPercentage?.toString(),
      },
    });
  };

  const handleProvideFeedback = () => {
    router.push({
      pathname: "/help-improve-ai",
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

  // Show rejection state when safety gate rejects the image
  if (speciesResult && !speciesResult.success) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View className="pt-4 pb-5">
            <ScreenHeader
              title="Identification Results"
              leftIcon="chevron-back"
              onLeftPress={handleBackPress}
            />
          </View>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons
            name="image-off-outline"
            size={64}
            color="#F59E0B"
          />
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
            Can't Detect Ant
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            {speciesResult.message || "The image doesn't appear to contain a real ant. Please try again with a photo of a real ant."}
          </Text>
          {imageUri && (
            <View className="mt-6 w-48 h-48 rounded-xl overflow-hidden border border-gray-200">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}
          <View className="mt-8 w-full">
            <PrimaryButton
              title="Try Another Photo"
              icon="camera-outline"
              onPress={handleIdentifyAnother}
              size="large"
            />
          </View>
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
