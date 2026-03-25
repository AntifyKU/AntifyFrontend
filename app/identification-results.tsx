import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
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
import { openIdentifySheet } from "@/utils/identifyHelper";

type IdentificationParams = {
  imageUri?: string;
  source?: string;
};

export default function IdentificationResultsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<IdentificationParams>();
  const { imageUri, source } = params;

  const {
    speciesResult,
    speciesInfo,
    loading: identifyLoading,
    error: identifyError,
    identifySpecies,
  } = useIdentification();

  const { species: allSpecies } = useSpecies();
  const {
    province,
    loading: locationLoading,
    permissionDenied,
  } = useLocation();
  const { provinceSpecies, loading: loadingProvinceSpecies } =
    useProvinceSpecies(province);

  const [hasIdentified, setHasIdentified] = useState(false);

  useEffect(() => {
    if (imageUri && !hasIdentified && !identifyLoading) {
      setHasIdentified(true);
      identifySpecies(imageUri);
    }
  }, [imageUri, hasIdentified, identifyLoading, identifySpecies]);

  const { bestMatch, otherMatches, totalMatches, isNotAnAnt } = useMemo(() => {
    const JUNK_LABELS = new Set(["life", "unknown", "animalia", "insecta"]);
    const isJunk = (name: string) =>
      JUNK_LABELS.has(name.toLowerCase().replaceAll("_", " ").trim());

    if (
      speciesResult?.success &&
      speciesResult.predictions &&
      speciesResult.predictions.length > 0
    ) {
      const predictions = speciesResult.predictions.filter(
        (p) => !isJunk(p.class_name),
      );

      if (predictions.length > 0) {
        const bestPrediction = predictions[0];
        const isOriginalTop =
          bestPrediction.class_name === speciesResult.predictions[0].class_name;
        const speciesInfoIsJunk = speciesInfo
          ? isJunk(speciesInfo.name)
          : false;
        const effectiveInfo =
          isOriginalTop && !speciesInfoIsJunk ? speciesInfo : null;

        const bestMatchItem = {
          id: effectiveInfo?.id ?? `prediction-0`,
          name:
            effectiveInfo?.name ??
            bestPrediction.class_name.replaceAll("_", " "),
          scientificName:
            effectiveInfo?.scientific_name ?? bestPrediction.class_name,
          image: effectiveInfo?.image ?? "",
          matchPercentage: Number((bestPrediction.confidence * 100).toFixed(1)),
          confidence: bestPrediction.confidence,
          riskInfo: effectiveInfo?.risk,
          isInDatabase: effectiveInfo !== null,
        };

        const otherMatchItems = predictions
          .slice(1)
          .map((pred, index) => {
            const matchedSpecies = allSpecies.find(
              (s) =>
                s.scientific_name === pred.class_name ||
                s.id === pred.species_id ||
                s.name.toLowerCase() ===
                  pred.class_name.replaceAll("_", " ").toLowerCase(),
            );

            const validSpecies =
              matchedSpecies && !isJunk(matchedSpecies.name)
                ? matchedSpecies
                : null;
            return {
              id:
                validSpecies?.id ??
                pred.species_id ??
                `prediction-${index + 1}`,
              name: validSpecies?.name ?? pred.class_name.replaceAll("_", " "),
              scientificName: validSpecies?.scientific_name ?? pred.class_name,
              image: validSpecies?.image ?? "",
              matchPercentage: Number((pred.confidence * 100).toFixed(1)),
              confidence: pred.confidence,
              riskInfo: validSpecies?.risk,
            };
          })
          .filter((item) => !isJunk(item.name));

        return {
          bestMatch: bestMatchItem,
          otherMatches: otherMatchItems,
          totalMatches: predictions.length,
          isNotAnAnt: false,
        };
      } else if (speciesResult.predictions && speciesResult.predictions.length > 0) {
        // All predictions were junk
        return {
          bestMatch: null,
          otherMatches: [],
          totalMatches: 0,
          isNotAnAnt: true,
        };
      }
    }
    return {
      bestMatch: null,
      otherMatches: [],
      totalMatches: 0,
      isNotAnAnt: false,
    };
  }, [speciesResult, speciesInfo, allSpecies]);

  const handleBackPress = () => router.back();

  const handleProvideFeedback = () => {
    if (!bestMatch) return;

    router.push({
      pathname: "/help-improve-ai",
      params: {
        imageUri,
        antName: bestMatch.name,
        scientificName: bestMatch.scientificName,
        confidence: String(bestMatch.confidence),
        source,
      },
    });
  };

  const handleConfirmAndViewDetails = (antId: string) => {
    if (!bestMatch) return;
    const isUnidentified =
      !antId ||
      antId.startsWith("prediction-") ||
      (bestMatch as any).isInDatabase !== true;

    if (isUnidentified) {
      Alert.alert(
        t("identification.alert_not_found_title"),
        t("identification.alert_not_found_desc"),
        [
          {
            text: t("identification.help_improve"),
            onPress: handleProvideFeedback,
          },
          { text: t("common.ok"), style: "cancel" },
        ],
      );
      return;
    }
    router.push({
      pathname: "/detail/[id]",
      params: {
        id: antId,
        imageUri,
        source,
        fromIdentification: "true",
        confidence: String(bestMatch.confidence),
      },
    });
  };

  const handleIdentifyAnother = () => {
    router.dismissAll();
    openIdentifySheet();
  };

  if (identifyLoading) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1">
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-6 text-xl font-bold text-gray-800 text-center">
              {t("identification.analyzing")}
            </Text>
            <Text className="mt-2 text-gray-500 text-center">
              {t("identification.analyzing_desc")}
            </Text>
            {imageUri && (
              <View className="mt-8 w-48 h-48 rounded-xl overflow-hidden">
                <Image source={{ uri: imageUri }} className="w-full h-full" />
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (identifyError || (!bestMatch && !isNotAnAnt)) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView>
          <View className="flex-row items-center px-4 py-2">
            <TouchableOpacity onPress={handleBackPress} className="p-2">
              <Ionicons name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-gray-800 mr-10">
              {t("identification.failed_title")}
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
            {t("identification.unable_to_identify")}
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            {t("identification.unable_desc")}
          </Text>
          <View className="mt-8 w-full">
            <PrimaryButton
              title={t("identification.try_again")}
              icon="camera-outline"
              onPress={handleIdentifyAnother}
              size="large"
            />
          </View>
        </View>
      </View>
    );
  }

  // Show rejection state when safety gate rejects the image or it's not an ant
  if ((speciesResult && !speciesResult.success) || isNotAnAnt) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View className="pt-4 pb-5">
            <ScreenHeader
              title={t("identification.title")}
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
            {t("identification.detect_reject_title")}
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            {isNotAnAnt
              ? t("identification.detect_reject_desc")
              : speciesResult?.message || t("identification.unable_desc")}
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
              title={t("identification.try_again")}
              icon="camera-outline"
              onPress={handleIdentifyAnother}
              size="large"
            />
          </View>
        </View>
      </View>
    );
  }

  if (!bestMatch) return null;

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <View className="pt-4">
          <ScreenHeader
            title={t("identification.title")}
            leftIcon="chevron-back"
            onLeftPress={handleBackPress}
          />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View
          className="mx-4 bg-[#e8f5e0] rounded-2xl p-5 flex-row items-center gap-4"
          style={{
            shadowColor: "#0A9D5C",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <View className="w-11 h-11 rounded-full bg-[#0A9D5C] items-center justify-center">
            <Ionicons name="checkmark" size={22} color="#fff" />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[#0A9D5C] font-bold text-lg leading-tight">
              {t("identification.analysis_complete")}
            </Text>
            <Text className="text-gray-800 text-base opacity-75 mt-0.5">
              {t("identification.matches_found", { count: totalMatches })}
            </Text>
          </View>
        </View>

        <View className="mx-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {t("identification.best_match")}
          </Text>
          <View className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <View className="h-40 bg-[#e8f5e0] items-center justify-center">
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-full" />
              ) : (
                <MaterialCommunityIcons
                  name="image"
                  size={48}
                  color="#328e6e"
                />
              )}
            </View>
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-800">
                {bestMatch.name}
              </Text>
              <Text className="text-gray-500 text-sm italic">
                {bestMatch.scientificName}
              </Text>
              <Text className="text-[#0A9D5C] font-semibold mt-1">
                {t("helpImprove.matchPercentage", {
                  value: bestMatch.matchPercentage.toFixed(1),
                })}
              </Text>

              {bestMatch.riskInfo && (
                <View className="mt-2">
                  <RiskTags riskInfo={bestMatch.riskInfo} size="small" />
                </View>
              )}

              <TouchableOpacity
                className="mt-4 py-3 rounded-full border-2 border-[#0A9D5C] items-center"
                onPress={() => handleConfirmAndViewDetails(bestMatch.id)}
              >
                <Text className="text-[#0A9D5C] font-semibold">
                  {t("identification.confirm_details")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <LocationSpeciesCard
          predictions={[
            {
              id: bestMatch.id,
              name: bestMatch.name,
              scientificName: bestMatch.scientificName,
              image: bestMatch.image,
              matchPercentage: bestMatch.matchPercentage,
            },
            ...otherMatches,
          ]}
          province={province}
          loadingLocation={locationLoading}
          permissionDenied={permissionDenied}
          provinceSpecies={provinceSpecies}
          loadingProvinceSpecies={loadingProvinceSpecies}
        />

        <View className="mx-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {t("identification.other_possibilities")}
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
              onPress={() =>
                router.push({
                  pathname: "/detail/[id]",
                  params: { id: ant.id },
                })
              }
              riskInfo={(ant as any).riskInfo}
            />
          ))}
        </View>
        <View className="h-32" />
        {/* Bottom Padding */}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
        <SafeAreaView edges={["bottom"]}>
          <PrimaryButton
            title={t("identification.identify_another")}
            icon="camera-outline"
            onPress={handleIdentifyAnother}
            size="large"
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
