import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import StarRating from "@/components/StarRating";
import { feedbackService } from "@/services/feedback";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import AntCard from "@/components/molecule/AntCard";

type HelpImproveParams = {
  imageUri?: string;
  antName?: string;
  scientificName?: string;
  confidence?: string;
};

export default function HelpImproveAIScreen() {
  const { t } = useTranslation();
  const { imageUri, antName, scientificName, confidence } =
    useLocalSearchParams<HelpImproveParams>();

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confidenceFloat = confidence ? Number.parseFloat(confidence) : null;

  const formatConfidenceValue = (value: number): string => {
    return value <= 1 ? (value * 100).toFixed(2) : value.toFixed(2);
  };

  const confidencePercent =
    confidenceFloat !== null && !Number.isNaN(confidenceFloat)
      ? formatConfidenceValue(confidenceFloat)
      : null;

  const getMatchPercentage = (): number | undefined => {
    if (confidenceFloat === null || Number.isNaN(confidenceFloat)) {
      return undefined;
    }
    return confidenceFloat <= 1 ? confidenceFloat * 100 : confidenceFloat;
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
      let normalizedConfidence: number | undefined;
      if (confidenceFloat === null) {
        normalizedConfidence = undefined;
      } else if (confidenceFloat <= 1) {
        normalizedConfidence = confidenceFloat;
      } else {
        normalizedConfidence = confidenceFloat / 100;
      }

      await feedbackService.submitAIFeedback({
        original_prediction: scientificName ?? antName ?? "",
        confidence_was: normalizedConfidence,
        is_correct: isCorrect,
        additional_notes: additionalNotes || undefined,
        rating: rating > 0 ? rating : undefined,
      });
      Alert.alert(
        t("helpImprove.successTitle"),
        t("helpImprove.successMessage"),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submitting feedback:", error.message);
      } else {
        console.error("Error submitting feedback:", error);
      }
    } finally {
      setIsSubmitting(false);
      router.dismissAll();
      router.replace("/(tabs)/index-home");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={["top"]}>
        <View className="pt-4 pb-5">
          <ScreenHeader
            title={t("helpImprove.title")}
            leftIcon="close"
            onLeftPress={() => router.push("/(tabs)/index-home")}
          />
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Result card */}
        <View className="mx-4 mt-4">
          <AntCard
            id=""
            name={antName ?? "—"}
            scientificName={scientificName ?? "—"}
            image={imageUri}
            matchPercentage={getMatchPercentage()}
            showMatchPercentage={confidencePercent !== null}
            variant="horizontal"
          />
        </View>

        {/* Correct / Incorrect */}
        <View className="mx-4 mt-8">
          <Text className="text-xl font-bold text-gray-800 text-center mb-2">
            {t("helpImprove.questionTitle")}
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            {t("helpImprove.questionSubtitle")}
          </Text>

          <View className="flex-row justify-center gap-4">
            <Pressable
              className={`flex-1 py-4 rounded-xl items-center border-2 ${
                isCorrect === true
                  ? "bg-[#0A9D5C] border-[#0A9D5C]"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => setIsCorrect(true)}
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
              onPress={() => setIsCorrect(false)}
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

        {/* Star rating */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t("helpImprove.rateTitle")}
          </Text>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>

        {/* Notes */}
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

        {/* Submit */}
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

        <View className="mx-4 mb-8">
          <Text className="text-center text-gray-400 text-sm">
            {t("helpImprove.footerNote")}
          </Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
});
