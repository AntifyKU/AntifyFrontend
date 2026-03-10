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
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/atom/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { from } = useLocalSearchParams<{ from?: string }>();

  function validateForm(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("auth.login.errorEmailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.login.errorEmailInvalid");
    }

    if (!password) {
      newErrors.password = t("auth.login.errorPasswordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("auth.login.errorPasswordTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleLogin = () => {
    if (!validateForm()) return;
    const run = async () => {
      try {
        await login(email, password);
        Alert.alert(
          t("auth.login.successTitle"),
          t("auth.login.successMessage"),
          [{ text: t("common.ok"), onPress: navigate }],
        );
      } catch (error: any) {
        Alert.alert(
          t("auth.login.failedTitle"),
          error.message || t("auth.login.failedDefault"),
        );
      }
    };
    run();
  };

  function navigate() {
    if (from === "onboarding" || !router.canGoBack()) {
      router.replace("/(tabs)");
    } else {
      router.back();
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
              onLeftPress={navigate}
            />
          </View>

          <View className="flex-1 px-6 pt-8">
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                <Ionicons name="leaf" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-gray-800">
                {t("auth.login.title")}
              </Text>
              <Text className="text-gray-500 mt-2 text-lg">
                {t("auth.login.subtitle")}
              </Text>
            </View>

            <View className="mb-6">
              <TextInput
                label={t("auth.login.emailLabel")}
                icon="mail-outline"
                placeholder={t("auth.login.emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                containerStyle={{ marginBottom: 16 }}
              />

              <TextInput
                label={t("auth.login.passwordLabel")}
                icon="lock-closed-outline"
                placeholder={t("auth.login.passwordPlaceholder")}
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                containerStyle={{ marginBottom: 8 }}
              />

              <TouchableOpacity
                className="self-end mb-6"
                onPress={() => router.push("/(auth)/forgotpassword")}
              >
                <Text className="text-[#0A9D5C] font-medium">
                  {t("auth.login.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <PrimaryButton
                title={
                  isLoading
                    ? t("auth.login.submittingButton")
                    : t("auth.login.submitButton")
                }
                onPress={handleLogin}
                disabled={isLoading}
                icon={isLoading ? undefined : "log-in-outline"}
              />
            </View>
          </View>

          <View className="px-6 pb-8">
            <View className="flex-row justify-center">
              <Text className="text-gray-500">
                {t("auth.login.noAccount")}{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-[#0A9D5C] font-semibold">
                  {t("auth.login.signUp")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-2xl p-6">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-3 text-gray-600">
              {t("auth.login.submittingButton")}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
