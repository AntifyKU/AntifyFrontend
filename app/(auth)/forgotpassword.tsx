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
import { auth } from "@/config/firebase";
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/atom/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  function validateEmail(): boolean {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleResetPassword() {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());

      setEmailSent(true);
      Alert.alert(
        "Email Sent!",
        "We've sent a password reset link to your email. Please check your inbox and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send reset email. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    router.back();
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
          {/* Header */}
          <View className="pt-6">
            <ScreenHeader
              title=""
              leftIcon="chevron-back"
              onLeftPress={handleBack}
            />
          </View>

          {/* Content */}
          <View className="flex-1 px-6 pt-8">
            {!emailSent ? (
              <>
                <View className="items-center mb-8">
                  <View className="w-20 h-20 rounded-full bg-[#0A9D5C] items-center justify-center mb-4">
                    <Ionicons name="mail" size={40} color="#FFFFFF" />
                  </View>
                  <Text className="text-3xl font-bold text-gray-800">
                    Forgot Password?
                  </Text>
                  <Text className="text-gray-500 mt-2 text-center text-base px-4">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password
                  </Text>
                </View>

                <View className="mb-6">
                  <TextInput
                    label="Email"
                    icon="mail-outline"
                    placeholder="Enter your email"
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
                    title={isLoading ? "Sending..." : "Send Reset Link"}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    icon={isLoading ? undefined : "send"}
                  />
                </View>

                {/* Info Box */}
                <View className="bg-green-50 p-4 rounded-2xl mb-6">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#0A9D5C"
                      style={{ marginTop: 2, marginRight: 8 }}
                    />
                    <Text className="flex-1 text-sm text-gray-700 leading-5">
                      You will receive an email with a secure link to reset your
                      password. The link will expire in 1 hour.
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View className="items-center">
                <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
                  <Ionicons name="checkmark-circle" size={60} color="#0A9D5C" />
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-3">
                  Check Your Email
                </Text>
                <Text className="text-gray-500 text-center text-base px-4 mb-6">
                  We&apos;ve sent a password reset link to
                </Text>
                <Text className="text-[#0A9D5C] font-semibold text-base mb-8">
                  {email}
                </Text>

                <View className="w-full mb-6">
                  <PrimaryButton
                    title="Back to Login"
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
                    Resend Email
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer */}
          {!emailSent && (
            <View className="px-6 pb-8">
              <View className="flex-row justify-center">
                <Text className="text-gray-500">Remember your password? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text className="text-[#0A9D5C] font-semibold">Sign In</Text>
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
            <Text className="mt-3 text-gray-600">Sending reset email...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
