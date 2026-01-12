import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Navbar } from "../components/molecule/Navbar";
import { InputField } from "../components/molecule/InputField";
import { Button } from "../components/atom/Button";
import { useRouter } from "expo-router";

const ForgotPassword: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBack = () => {
    console.log("Back button pressed");
    router.back();
  };

  const validateForm = (): boolean => {
    console.log("Validating form...");
    const newErrors: {
      email?: string;
    } = {};

    // Validate email
    if (!email.trim()) {
      console.log("Email is empty");
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("Invalid email format");
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    console.log("Validation result:", isValid);
    return isValid;
  };

  const handleSendLink = () => {
    console.log("Send link button pressed");
    console.log("Email:", email);

    if (validateForm()) {
      console.log("Form is valid - sending reset link");
      setIsSubmitted(true);
      // TODO: Call forgot password API here

      // Show success message
      Alert.alert(
        "Email Sent",
        "We've sent a password reset link to your email address. Please check your inbox.",
        [
          {
            text: "OK",
            onPress: () => {
              // Optionally navigate back to login after a delay
              setTimeout(() => {
                router.back();
              }, 1000);
            },
          },
        ]
      );
    } else {
      console.log("Form validation failed");
    }
  };

  const handleBackToLogin = () => {
    console.log("Back to login pressed");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Navbar
        leftIcon="chevron-back-outline"
        onLeftPress={handleBack}
        leftIconColor="#00A63E"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Don&apos;t worry! Enter your email address and we&apos;ll send you a link
                to reset your password.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View>
                <InputField
                  title="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    console.log("Email changed:", text);
                    setEmail(text);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                    setIsSubmitted(false);
                  }}
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
            </View>

            {/* Send Reset Link Button */}
            <Button
              title="Send Reset Link"
              onPress={handleSendLink}
              variant="primary"
              style={styles.sendButton}
              disabled={isSubmitted}
            />

            {/* Back to Login Link */}
            <View style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>
                Remember your password?{" "}
              </Text>
              <Text style={styles.backToLoginLink} onPress={handleBackToLogin}>
                Back to Login
              </Text>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpText}>
                If you don&apos;t receive the email within a few minutes, please
                check your spam folder or contact our support team.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#62748E",
    lineHeight: 24,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  errorText: {
    color: "#E7000B",
    fontSize: 12,
    marginTop: 4,
  },
  sendButton: {
    marginBottom: 24,
  },
  backToLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  backToLoginText: {
    fontSize: 14,
    color: "#62748E",
    fontWeight: "400",
  },
  backToLoginLink: {
    fontSize: 14,
    color: "#00A63E",
    fontWeight: "500",
  },
  helpContainer: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172B",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#62748E",
    lineHeight: 18,
  },
});

export default ForgotPassword;