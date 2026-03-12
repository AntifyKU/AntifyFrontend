import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useIdentification } from "@/hooks/useIdentification";
import AntCard from "@/components/molecule/AntCard";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import RiskTags from "@/components/molecule/RiskTags";
import { useSpecies } from "@/hooks/useSpecies";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { useLocation } from "@/hooks/useLocation";
import LocationSpeciesCard from "@/components/molecule/LocationSpeciesCard";
import { useProvinceSpecies } from "@/hooks/useProvinceSpecies";

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

  // Fetch full species list to enrich predictions
  const { species: allSpecies } = useSpecies();

  // Get user location for the species-in-area card
  const { province, loading: locationLoading, permissionDenied } = useLocation();

  // Fetch Firestore species confirmed in user's province (fires once province is known)
  const { provinceSpecies, loading: loadingProvinceSpecies } = useProvinceSpecies(province);

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
  const { bestMatch, otherMatches, totalMatches } =
    useMemo(() => {
      // Labels the AI emits when it can't identify the species
      const JUNK_LABELS = new Set(["life", "unknown", "animalia", "insecta"]);
      const isJunk = (name: string) =>
        JUNK_LABELS.has(name.toLowerCase().replace(/_/g, " ").trim());

      // If we have API results from the new species details endpoint
      if (speciesResult?.success && speciesResult.predictions && speciesResult.predictions.length > 0) {
        // Strip junk predictions first, then pick best from what remains
        const predictions = speciesResult.predictions.filter(
          (p) => !isJunk(p.class_name)
        );

        if (predictions.length === 0) {
          // All predictions were junk — fall through to static fallback
        } else {
          // Build best match: use speciesInfo only if the top prediction didn't change
          // AND the speciesInfo itself doesn't have a junk name (e.g. "Life" from Firestore)
          const bestPrediction = predictions[0];
          const isOriginalTop = bestPrediction.class_name === speciesResult.predictions[0].class_name;
          const speciesInfoIsJunk = speciesInfo ? isJunk(speciesInfo.name) : false;
          const effectiveInfo = (isOriginalTop && !speciesInfoIsJunk) ? speciesInfo : null;

          const bestMatchItem = {
            id: effectiveInfo?.id ?? `prediction-0`,
            name: effectiveInfo?.name ?? bestPrediction.class_name.replace(/_/g, " "),
            scientificName: effectiveInfo?.scientific_name ?? bestPrediction.class_name,
            image: effectiveInfo?.image ?? "",
            matchPercentage: Number((bestPrediction.confidence * 100).toFixed(1)),
            riskInfo: effectiveInfo?.risk,
            isInDatabase: effectiveInfo !== null,  // true only when we have real Firestore data
          };

          // Other predictions (try to enrich from allSpecies)
          // Also discard any matched species whose name is itself a junk label
          const otherMatchItems = predictions.slice(1).map((pred, index) => {
            const matchedSpecies = allSpecies.find((s) =>
              s.scientific_name === pred.class_name ||
              s.id === pred.species_id ||
              s.name.toLowerCase() === pred.class_name.replace(/_/g, " ").toLowerCase()
            );

            // Reject matched species if its name is a junk label
            const validSpecies = matchedSpecies && !isJunk(matchedSpecies.name) ? matchedSpecies : null;
            const displayName = validSpecies?.name ?? pred.class_name.replace(/_/g, " ");

            return {
              id: validSpecies?.id ?? pred.species_id ?? `prediction-${index + 1}`,
              name: displayName,
              scientificName: validSpecies?.scientific_name ?? pred.class_name,
              image: validSpecies?.image ?? "",
              matchPercentage: Number((pred.confidence * 100).toFixed(1)),
              riskInfo: validSpecies?.risk,
            };
          }).filter((item) => !isJunk(item.name)); // final safety net

          return {
            bestMatch: bestMatchItem,
            otherMatches: otherMatchItems,
            totalMatches: predictions.length,
            isUsingFallback: false,
          };
        }
      }

      // No valid predictions
      return {
        bestMatch: null,
        otherMatches: [],
        totalMatches: 0,
        isUsingFallback: false,
      };
    }, [speciesResult, speciesInfo, allSpecies]);

  const handleBackPress = () => {
    router.back();
  };

  const handleConfirmAndViewDetails = (antId: string) => {
    if (!bestMatch) return;

    // Show alert if we have no real Firestore species data:
    // - antId is missing or is a placeholder ("prediction-X")
    // - isInDatabase is explicitly false (junk prediction filtered) OR undefined (static fallback)
    const isUnidentified =
      !antId ||
      antId.startsWith("prediction-") ||
      (bestMatch as any).isInDatabase !== true;

    if (isUnidentified) {
      Alert.alert(
        "Species Not in Database",
        "We couldn't match this ant to a known species in our database yet. This could be a rare or undocumented species, or the photo may need better lighting / angle for a more accurate result.",
        [
          {
            text: "Help Improve AI",
            onPress: handleProvideFeedback,
          },
          { text: "OK", style: "cancel" },
        ]
      );
      return;
    }
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
        matchPercentage: bestMatch.matchPercentage?.toFixed(2),
      },
    });
  };

  const handleProvideFeedback = () => {
    if (!bestMatch) return;
    
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
  };

  const handleOtherMatchPress = (ant: {
    id: string;
    name: string;
    scientificName: string;
    image: string;
    matchPercentage: number;
    riskInfo?: any;
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

  // Show error state if identification failed or no valid matches
  if (identifyError || !bestMatch) {
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
          <View className="mt-8 w-full">
            <PrimaryButton
              title="Try Again"
              icon="camera-outline"
              onPress={handleIdentifyAnother}
              size="large"
            />
          </View>
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
            Can&apos;t Detect Ant
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
                {bestMatch.matchPercentage.toFixed(2)}% Match
              </Text>

              {/* Added RiskTags for Best Match */}
              {(bestMatch as any).riskInfo && (
                <View className="mt-2">
                  <RiskTags riskInfo={(bestMatch as any).riskInfo} size="small" />
                </View>
              )}

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

        {/* Location Species Card */}
        <LocationSpeciesCard
          predictions={[
            {
              id: bestMatch.id,
              name: bestMatch.name,
              scientificName: bestMatch.scientificName,
              image: bestMatch.image,
              matchPercentage: bestMatch.matchPercentage ?? 0,
              distribution: (bestMatch as any).distribution,
            },
            ...otherMatches.map((ant) => ({
              id: ant.id,
              name: ant.name,
              scientificName: ant.scientificName,
              image: ant.image,
              matchPercentage: ant.matchPercentage ?? 0,
              distribution: (ant as any).distribution,
            })),
          ]}
          province={province}
          loadingLocation={locationLoading}
          permissionDenied={permissionDenied}
          provinceSpecies={provinceSpecies}
          loadingProvinceSpecies={loadingProvinceSpecies}
        />

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
              riskInfo={(ant as any).riskInfo}
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
