import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navbar } from "../../components/molecule/Navbar";
import { InputField } from "../../components/molecule/InputField";
import { Checkbox } from "../../components/atom/Checkbox";
import { Button } from "../../components/atom/Button";
import { useRouter } from "expo-router";
import { signup } from "@/services/authService";

const Signup: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const handleBack = () => {
    // back to login page
    router.push({
      pathname: "/(pages)/Login",
      params: { from: "signup" },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // Validate terms agreement
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and privacy policy";
      return false;
    }

    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await signup(username, email, password);

      Alert.alert(
        "Signup Successful",
        "Your account has been created successfully"
      );
      router.push({
        pathname: "/(pages)/Login",
        params: { from: "signup" },
      });
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsPress = () => {
    // TODO: Show popup of terms and conditions
    console.log("Terms and Conditions pressed");
    Alert.alert("Terms and Conditions", "View terms and conditions page");
  };

  const handlePrivacyPress = () => {
    // TODO: Show popup of privacy policy
    console.log("Privacy Policy pressed");
    Alert.alert("Privacy Policy", "View privacy policy page");
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: slideAnim }],
        }}
      >
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
                <Text style={styles.title}>Sign up</Text>
                <Text style={styles.subtitle}>
                  Create an account to get started
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <View>
                  <InputField
                    title="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setErrors((prev) => ({ ...prev, username: undefined }));
                    }}
                  />
                  {errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>

                <View>
                  <InputField
                    title="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View>
                  <InputField
                    title="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    secureTextEntry={true}
                    showPasswordToggle={true}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View>
                  <InputField
                    title="Confirm Password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }}
                    secureTextEntry={true}
                    showPasswordToggle={true}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Checkbox
                  checked={agreeTerms}
                  onToggle={() => {
                    setAgreeTerms(!agreeTerms);
                  }}
                />
                <Text style={styles.termsText}>
                  I&apos;ve read and agree with the{" "}
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    Terms and Conditions
                  </Text>{" "}
                  and the{" "}
                  <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              {errors.agreeTerms && (
                <Text style={styles.errorText}>{errors.agreeTerms}</Text>
              )}

              <Button
                title={loading ? "Signing up..." : "Sign up"}
                onPress={handleSignup}
                variant="primary"
                style={styles.signupButton}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#62748E",
    lineHeight: 16,
    fontWeight: "400",
  },
  termsLink: {
    color: "#00A63E",
    fontWeight: "500",
  },
  signupButton: {
    marginTop: 24,
  },
});

export default Signup;
