"use client";

import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { speciesListForCorrection } from "@/constants/AntData";
import StarRating from "@/components/StarRating";
import { feedbackService } from "@/services/feedback";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

// Define the type for route params
type HelpImproveParams = {
  imageUri?: string;
  antId?: string;
  antName?: string;
  scientificName?: string;
  matchPercentage?: string;
  source?: string;
};

export default function HelpImproveAIScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<HelpImproveParams>();
  const { imageUri, antId, antName, scientificName, matchPercentage } = params;

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(
    null,
  );
  const [rating, setRating] = useState<number>(0);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmitFeedback = async () => {
    if (isCorrect === null) {
      Alert.alert(
        t("helpImprove.validationTitle"),
        t("helpImprove.validationMessage"),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isCorrect === false && selectedSpeciesId) {
        const correctionData = {
          original_prediction: antName || "",
          correct_species_id: selectedSpeciesId,
          notes: additionalNotes || undefined,
        };

        await feedbackService.submitAICorrection(correctionData);
      } else {
        const feedbackData = {
          rating,
          additional_notes: additionalNotes || undefined,
          species_id: antId || undefined,
        };

        await feedbackService.submitFeedback(feedbackData);
      }

      router.dismissAll();
      router.replace("/(tabs)/index-home");
    } catch (error) {
      console.error("Error submitting feedback:", error);

      router.dismissAll();
      router.replace("/(tabs)/index-home");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrectPress = () => {
    setIsCorrect(true);
    setSelectedSpeciesId(null);
  };

  const handleIncorrectPress = () => {
    setIsCorrect(false);
  };

  const handleSpeciesSelect = (speciesId: string) => {
    setSelectedSpeciesId(speciesId);
  };

  const filteredSpecies = speciesListForCorrection.filter((species) =>
    species.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView edges={["top"]}>
        <View className="pt-4 pb-5">
          <ScreenHeader
            title={t("helpImprove.title")}
            leftIcon="chevron-back"
            onLeftPress={handleBackPress}
          />
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
            <Text className="font-bold text-gray-800 text-lg">
              {antName || "Weaver Ant"}
            </Text>
            <Text className="text-gray-500 text-sm italic">
              {scientificName || "Oecophylla smaragdina"}
            </Text>
            <Text className="text-[#0A9D5C] font-semibold">
              {t("helpImprove.matchPercentage", {
                value: matchPercentage || "85",
              })}
            </Text>
          </View>
        </View>

        {/* Was this identification correct? */}
        <View className="mx-4 mt-8">
          <Text className="text-xl font-bold text-gray-800 text-center mb-2">
            {t("helpImprove.questionTitle")}
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            {t("helpImprove.questionSubtitle")}
          </Text>

          {/* Yes/No Buttons */}
          <View className="flex-row justify-center gap-4">
            <Pressable
              className={`flex-1 py-4 rounded-xl items-center border-2 ${
                isCorrect === true
                  ? "bg-[#0A9D5C] border-[#0A9D5C]"
                  : "bg-white border-gray-200"
              }`}
              onPress={handleCorrectPress}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                  isCorrect === true ? "bg-white/20" : "bg-[#e8f5e0]"
                }`}
              >
                <Ionicons
                  name="thumbs-up"
                  size={24}
                  color={isCorrect === true ? "#fff" : "#0A9D5C"}
                />
              </View>
              <Text
                className={`font-semibold ${
                  isCorrect === true ? "text-white" : "text-[#0A9D5C]"
                }`}
              >
                {t("helpImprove.correct")}
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 py-4 rounded-xl items-center border-2 ${
                isCorrect === false
                  ? "bg-[#EF4444] border-[#EF4444]"
                  : "bg-white border-gray-200"
              }`}
              onPress={handleIncorrectPress}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                  isCorrect === false ? "bg-white/20" : "bg-[#FEE2E2]"
                }`}
              >
                <Ionicons
                  name="thumbs-down"
                  size={24}
                  color={isCorrect === false ? "#fff" : "#EF4444"}
                />
              </View>
              <Text
                className={`font-semibold ${
                  isCorrect === false ? "text-white" : "text-[#EF4444]"
                }`}
              >
                {t("helpImprove.incorrect")}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Species Selection (only shown when "No, Incorrect" is selected) */}
        {isCorrect === false && (
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              {t("helpImprove.selectSpecies")}
            </Text>

            {/* Search Input */}
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-2 text-gray-700"
                placeholder={t("helpImprove.searchPlaceholder")}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Species not in list option */}
            <Pressable
              className={`flex-row items-center p-3 mb-2 rounded-xl border ${
                selectedSpeciesId === "not-in-list"
                  ? "border-[#0A9D5C] bg-[#e8f5e0]"
                  : "border-gray-200"
              }`}
              onPress={() => handleSpeciesSelect("not-in-list")}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text className="text-gray-600">
                {t("helpImprove.notInList")}
              </Text>
            </Pressable>

            {/* Species List */}
            {filteredSpecies.map((species) => (
              <Pressable
                key={species.id}
                className={`flex-row items-center p-3 mb-2 rounded-xl border ${
                  selectedSpeciesId === species.id
                    ? "border-[#0A9D5C] bg-[#e8f5e0]"
                    : "border-gray-200"
                }`}
                onPress={() => handleSpeciesSelect(species.id)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                {/* Thumbnail */}
                <View className="w-12 h-12 rounded-lg bg-[#d4e8c7] items-center justify-center mr-3 overflow-hidden">
                  {species.image ? (
                    <Image
                      source={{ uri: species.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="image"
                      size={20}
                      color="#328e6e"
                    />
                  )}
                </View>

                {/* Details */}
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">
                    {species.name}
                  </Text>
                  <Text className="text-gray-500 text-sm italic">
                    {species.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Rate prediction quality */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t("helpImprove.rateTitle")}
          </Text>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>

        {/* Additional Notes */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t("helpImprove.notesTitle")}
          </Text>
          <TextInput
            className="h-28 p-4 text-gray-700 border border-gray-200 rounded-xl bg-white"
            placeholder={t("helpImprove.notesPlaceholder")}
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
            className={`bg-[#0A9D5C] rounded-full py-4 flex-row items-center justify-center ${
              isSubmitting ? "opacity-70" : ""
            }`}
            onPress={handleSubmitFeedback}
            disabled={isSubmitting}
            style={({ pressed }) => !isSubmitting && pressed && styles.pressed}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold text-lg ml-2">
                  {t("helpImprove.submittingButton")}
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text className="text-white font-semibold text-lg ml-2">
                  {t("helpImprove.submitButton")}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Footer Note */}
        <View className="mx-4 mb-8">
          <Text className="text-center text-gray-400 text-sm">
            {t("helpImprove.footerNote")}
          </Text>
        </View>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
