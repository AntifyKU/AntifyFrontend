import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "@/config/firebase";
import TextInput from "@/components/atom/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  function validateEmail(): boolean {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("auth.forgotPassword.errorEmailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.forgotPassword.errorEmailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleResetPassword = () => {
    if (!validateEmail()) return;
    const run = async () => {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setEmailSent(true);
        Alert.alert(
          t("auth.forgotPassword.successTitle"),
          t("auth.forgotPassword.successMessage"),
          [
            {
              text: t("common.ok"),
              onPress: () => router.replace("/(auth)/login"),
            },
          ],
        );
      } catch (error: any) {
        console.error("Password reset error:", error);
        const message = getResetErrorMessage(error.code);
        Alert.alert(t("common.error"), message);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  };

  function getResetErrorMessage(code: string): string {
    switch (code) {
      case "auth/user-not-found":
        return t("auth.forgotPassword.errorUserNotFound");
      case "auth/invalid-email":
        return t("auth.forgotPassword.errorInvalidEmail");
      case "auth/too-many-requests":
        return t("auth.forgotPassword.errorTooManyRequests");
      case "auth/network-request-failed":
        return t("auth.forgotPassword.errorNetwork");
      default:
        return t("auth.forgotPassword.errorDefault");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pt-6">
            <ScreenHeader
              title=""
              leftIcon="chevron-back"
              onLeftPress={() => router.back()}
            />
          </View>

          <View className="flex-1 px-6 pt-8">
            {emailSent ? (
              <View className="items-center">
                <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
                  <Ionicons name="checkmark-circle" size={60} color="#0A9D5C" />
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-3">
                  {t("auth.forgotPassword.sentTitle")}
                </Text>
                <Text className="text-gray-500 text-center text-base px-4 mb-6">
                  {t("auth.forgotPassword.sentSubtitle")}
                </Text>
                <Text className="text-[#0A9D5C] font-semibold text-base mb-8">
                  {email}
                </Text>

                <View className="w-full mb-6">
                  <PrimaryButton
                    title={t("auth.forgotPassword.backToLogin")}
                    onPress={() => router.replace("/(auth)/login")}
                    icon="arrow-back"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  className="py-3"
                >
                  <Text className="text-[#0A9D5C] font-medium">
                    {t("auth.forgotPassword.resendEmail")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View className="items-center mb-8">
                  <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                    <Ionicons name="mail" size={40} color="#FFFFFF" />
                  </View>
                  <Text className="text-3xl font-bold text-gray-800">
                    {t("auth.forgotPassword.title")}
                  </Text>
                  <Text className="text-gray-500 mt-2 text-center text-base px-4">
                    {t("auth.forgotPassword.subtitle")}
                  </Text>
                </View>

                <View className="mb-6">
                  <TextInput
                    label={t("auth.forgotPassword.emailLabel")}
                    icon="mail-outline"
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({});
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={errors.email}
                    containerStyle={{ marginBottom: 16 }}
                  />

                  <PrimaryButton
                    title={
                      isLoading
                        ? t("auth.forgotPassword.submittingButton")
                        : t("auth.forgotPassword.submitButton")
                    }
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    icon={isLoading ? undefined : "send"}
                  />
                </View>

                <View className="bg-green-50 p-4 rounded-2xl mb-6">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#0A9D5C"
                      style={{ marginTop: 2, marginRight: 8 }}
                    />
                    <Text className="flex-1 text-sm text-gray-700 leading-5">
                      {t("auth.forgotPassword.infoBox")}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {!emailSent && (
            <View className="px-6 pb-8">
              <View className="flex-row justify-center">
                <Text className="text-gray-500">
                  {t("auth.forgotPassword.rememberPassword")}{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text className="text-[#0A9D5C] font-semibold">
                    {t("auth.forgotPassword.signIn")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-2xl p-6">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-3 text-gray-600">
              {t("auth.forgotPassword.sendingOverlay")}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
