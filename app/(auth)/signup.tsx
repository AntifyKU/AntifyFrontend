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
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { Section } from "@/components/atom/Section";

export default function SignupScreen() {
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
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSignup() {
    if (!validateForm()) return;

    try {
      await signup(username, email, password);
      Alert.alert(
        "Account Created!",
        "Your account has been created successfully.",
      );
      // Navigation is handled by _layout.tsx based on auth state
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.message || "Unable to create account. Please try again.",
      );
    }
  }

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
          {/* Header */}
          <View className="pt-6">
            <ScreenHeader
              title=""
              leftIcon="chevron-back"
              onLeftPress={() => router.back()}
            />
          </View>

          {/* Content */}
          <View className="flex-1 px-6 pt-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                <Ionicons name="leaf" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-gray-800">
                Create Account
              </Text>
              <Text className="text-gray-500 mt-2 text-lg">
                Join Antify today
              </Text>
            </View>

            <View className="mb-6">
              <TextInput
                label="Username"
                icon="person-outline"
                placeholder="Choose a username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username}
                containerStyle={{ marginBottom: 16 }}
              />

              <TextInput
                label="Email"
                icon="mail-outline"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                containerStyle={{ marginBottom: 16 }}
              />

              <TextInput
                label="Password"
                icon="lock-closed-outline"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                containerStyle={{ marginBottom: 16 }}
              />

              <TextInput
                label="Confirm Password"
                icon="lock-closed-outline"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                error={errors.confirmPassword}
                containerStyle={{ marginBottom: 16 }}
              />
            </View>

            {/* Terms - Now clickable */}
            <Text className="text-gray-500 text-center text-sm mb-6">
              By signing up, you agree to our{" "}
              <Text
                className="text-[#0A9D5C] underline"
                onPress={() => openTerms("terms")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                className="text-[#0A9D5C] underline"
                onPress={() => openTerms("privacy")}
              >
                Privacy Policy
              </Text>
            </Text>

            <View className="mb-6">
              <PrimaryButton
                title={isLoading ? "Creating Account..." : "Create Account"}
                onPress={handleSignup}
                disabled={isLoading}
                icon={isLoading ? undefined : "person-add-outline"}
              />
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 pb-8">
            <View className="flex-row justify-center">
              <Text className="text-gray-500">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-[#0A9D5C] font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-2xl p-6">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-3 text-gray-600">Creating account...</Text>
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

          {/* Modal Header */}
          <View className="py-6">
            <ScreenHeader
              title={
                termsType === "terms" ? "Terms of Service" : "Privacy Policy"
              }
              leftIcon="chevron-back"
              onLeftPress={() => setShowTermsModal(false)}
            />
          </View>

          {/* Modal Content */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {termsType === "terms" ? (
              <View className="py-6">
                <Section
                  title="1. Acceptance of Terms"
                  content="By accessing and using Antify, you accept and agree to be bound by the terms and provision of this agreement."
                />

                <Section
                  title="2. Use of Service"
                  content="Antify is provided for personal, non-commercial use. You agree to use the app only for lawful purposes and in accordance with these Terms."
                />

                <Section
                  title="3. User Content"
                  content="You retain all rights to photos and content you upload. By uploading content, you grant Antify a license to use it solely for the purpose of species identification."
                />

                <Section
                  title="4. AI Accuracy"
                  content="While our AI strives for accuracy, species identification should be verified by experts for critical applications. We do not guarantee 100% accuracy."
                />

                <Section
                  title="5. Account Termination"
                  content="We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms."
                />

                <View className="items-center py-4 mb-4">
                  <Text className="text-sm text-gray-400">
                    Last updated: February 2026
                  </Text>
                </View>
              </View>
            ) : (
              <View className="py-6">
                <Section
                  title="Information We Collect"
                  content="We collect information you provide directly (email, username), usage data (photos for identification), and device information (location if enabled)."
                />

                <Section
                  title="How We Use Your Information"
                  content="Your data is used to: provide and improve our services, identify ant species, personalize your experience, and communicate with you about updates."
                />

                <Section
                  title="Data Storage"
                  content="Your photos and personal data are stored securely in the cloud. We use industry-standard encryption and security measures to protect your information."
                />

                <Section
                  title="Data Sharing"
                  content="We do not sell your personal information. We may share anonymized data with researchers to improve ant species databases and AI accuracy."
                />

                <Section
                  title="Your Rights"
                  content="You have the right to access, update, or delete your personal data at any time through your account settings or by contacting us."
                />

                <Section
                  title="Location Data"
                  content="Location data is used only to show nearby species and is never shared without your consent. You can disable location services in your device settings."
                />

                <View className="items-center py-4 mb-4">
                  <Text className="text-sm text-gray-400">
                    Last updated: February 2026
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Close Button
          <View className="px-6 pb-6">
            <PrimaryButton
              title="Close"
              onPress={() => setShowTermsModal(false)}
              variant="outlined"
              style={{ borderRadius: 12 }}
            />
          </View> */}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
