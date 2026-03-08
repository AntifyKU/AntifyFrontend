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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/atom/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { Section } from "@/components/atom/Section";

type TermsContentProps = Readonly<{
  t: (key: string) => string;
}>;

type PrivacyContentProps = Readonly<{
  t: (key: string) => string;
}>;

function TermsContent({ t }: TermsContentProps) {
  return (
    <View className="py-6">
      <Section
        title={t("support.terms.sections.acceptance.title")}
        content={t("support.terms.sections.acceptance.content")}
      />
      <Section
        title={t("support.terms.sections.use.title")}
        content={t("support.terms.sections.use.content")}
      />
      <Section
        title={t("support.terms.sections.userContent.title")}
        content={t("support.terms.sections.userContent.content")}
      />
      <Section
        title={t("support.terms.sections.aiAccuracy.title")}
        content={t("support.terms.sections.aiAccuracy.content")}
      />
      <Section
        title={t("support.terms.sections.termination.title")}
        content={t("support.terms.sections.termination.content")}
      />
      <View className="items-center py-4 mb-4">
        <Text className="text-sm text-gray-400">
          Last updated: February 2026
        </Text>
      </View>
    </View>
  );
}

function PrivacyContent({ t }: PrivacyContentProps) {
  return (
    <View className="py-6">
      <Section
        title={t("support.terms.sections.infoCollect.title")}
        content={t("support.terms.sections.infoCollect.content")}
      />
      <Section
        title={t("support.terms.sections.infoUse.title")}
        content={t("support.terms.sections.infoUse.content")}
      />
      <Section
        title={t("support.terms.sections.dataStorage.title")}
        content={t("support.terms.sections.dataStorage.content")}
      />
      <Section
        title={t("support.terms.sections.dataSharing.title")}
        content={t("support.terms.sections.dataSharing.content")}
      />
      <Section
        title={t("support.terms.sections.yourRights.title")}
        content={t("support.terms.sections.yourRights.content")}
      />
      <Section
        title={t("support.terms.sections.locationData.title")}
        content={t("support.terms.sections.locationData.content")}
      />
      <View className="items-center py-4 mb-4">
        <Text className="text-sm text-gray-400">
          Last updated: February 2026
        </Text>
      </View>
    </View>
  );
}

export default function SignupScreen() {
  const { t } = useTranslation();
  const { signup, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsType, setTermsType] = useState<"terms" | "privacy">("terms");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validateForm(): boolean {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = t("auth.signup.errorUsernameRequired");
    } else if (username.length < 3) {
      newErrors.username = t("auth.signup.errorUsernameTooShort");
    }

    if (!email.trim()) {
      newErrors.email = t("auth.signup.errorEmailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.signup.errorEmailInvalid");
    }

    if (!password) {
      newErrors.password = t("auth.signup.errorPasswordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("auth.signup.errorPasswordTooShort");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.signup.errorConfirmRequired");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("auth.signup.errorConfirmMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSignup = () => {
    if (!validateForm()) return;
    const run = async () => {
      try {
        await signup(username, email, password);
        Alert.alert(
          t("auth.signup.successTitle"),
          t("auth.signup.successMessage"),
        );
      } catch (error: any) {
        Alert.alert(
          t("auth.signup.failedTitle"),
          error.message || t("auth.signup.failedDefault"),
        );
      }
    };
    run();
  };

  const openTerms = (type: "terms" | "privacy") => {
    setTermsType(type);
    setShowTermsModal(true);
  };

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

          <View className="flex-1 px-6 pt-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                <Ionicons name="leaf" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-gray-800">
                {t("auth.signup.title")}
              </Text>
              <Text className="text-gray-500 mt-2 text-lg">
                {t("auth.signup.subtitle")}
              </Text>
            </View>

            <View className="mb-6">
              <TextInput
                label={t("auth.signup.usernameLabel")}
                icon="person-outline"
                placeholder={t("auth.signup.usernamePlaceholder")}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username}
                containerStyle={{ marginBottom: 16 }}
              />
              <TextInput
                label={t("auth.signup.emailLabel")}
                icon="mail-outline"
                placeholder={t("auth.signup.emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                containerStyle={{ marginBottom: 16 }}
              />
              <TextInput
                label={t("auth.signup.passwordLabel")}
                icon="lock-closed-outline"
                placeholder={t("auth.signup.passwordPlaceholder")}
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                containerStyle={{ marginBottom: 16 }}
              />
              <TextInput
                label={t("auth.signup.confirmPasswordLabel")}
                icon="lock-closed-outline"
                placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                error={errors.confirmPassword}
                containerStyle={{ marginBottom: 16 }}
              />
            </View>

            <Text className="text-gray-500 text-center text-sm mb-6">
              {t("auth.signup.termsPrefix")}{" "}
              <Text
                className="text-[#0A9D5C] underline"
                onPress={() => openTerms("terms")}
              >
                {t("auth.signup.termsLink")}
              </Text>{" "}
              {t("auth.signup.termsAnd")}{" "}
              <Text
                className="text-[#0A9D5C] underline"
                onPress={() => openTerms("privacy")}
              >
                {t("auth.signup.privacyLink")}
              </Text>
            </Text>

            <View className="mb-6">
              <PrimaryButton
                title={
                  isLoading
                    ? t("auth.signup.submittingButton")
                    : t("auth.signup.submitButton")
                }
                onPress={handleSignup}
                disabled={isLoading}
                icon={isLoading ? undefined : "person-add-outline"}
              />
            </View>
          </View>

          <View className="px-6 pb-8">
            <View className="flex-row justify-center">
              <Text className="text-gray-500">
                {t("auth.signup.hasAccount")}{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-[#0A9D5C] font-semibold">
                  {t("auth.signup.signIn")}
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
              {t("auth.signup.creatingOverlay")}
            </Text>
          </View>
        </View>
      )}

      {/* Terms & Privacy Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar style="dark" />
          <View className="py-6">
            <ScreenHeader
              title={
                termsType === "terms"
                  ? t("auth.termsModal.termsTitle")
                  : t("auth.termsModal.privacyTitle")
              }
              leftIcon="chevron-back"
              onLeftPress={() => setShowTermsModal(false)}
            />
          </View>
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator>
            {termsType === "terms" ? (
              <TermsContent t={t} />
            ) : (
              <PrivacyContent t={t} />
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
