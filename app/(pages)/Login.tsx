import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import { InputField } from "../../components/molecule/InputField";
import { Button } from "../../components/atom/Button";
import { GoogleButton } from "@/components/atom/GoogleButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { login } from "@/services/authService";

const Login: React.FC = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const screenWidth = Dimensions.get("window").width;
  const startX = from === "signup" ? -screenWidth : screenWidth;
  const slideAnim = useRef(new Animated.Value(startX)).current;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: {
      username?: string;
      password?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = "Username or email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await login(username, password);
      router.replace("/(tabs)/index-home");
    } catch (err: any) {
      Alert.alert("Login failed", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // TODO: Implement Google login functionality
  //   console.log("Google login pressed");
  // };

  // const handleForgotPassword = () => {
  //   router.push("/(pages)/ForgotPassword");
  // };

  const handleSignUp = () => {
    // Navigate to Signup page
    router.push("/(pages)/Signup");
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
        <StatusBar barStyle="dark-content" backgroundColor="#ECFCCA" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header} />

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome!</Text>

              <View style={styles.inputsContainer}>
                <InputField
                  title="Username or Email"
                  placeholder="Enter your username or email"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  keyboardType="email-address"
                />
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}

                <InputField
                  title="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  secureTextEntry
                  showPasswordToggle
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity> */}

              <Button
                title={loading ? "Logging in..." : "Log in"}
                onPress={handleLogin}
                variant="primary"
                style={styles.loginButton}
                disabled={loading}
              />

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Not a member? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signUpLink}>Sign up now</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.divider} />
              </View> */}

              {/* <TouchableOpacity style={styles.googleButton}>
                <GoogleButton onPress={handleGoogleLogin} />
              </TouchableOpacity> */}
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
  },
  header: {
    backgroundColor: "#ECFCCA",
    height: 300,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D293D",
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#E7000B",
    fontSize: 12,
    marginBottom: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#00A63E",
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    color: "#62748E",
  },
  signUpLink: {
    fontSize: 14,
    color: "#00A63E",
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 14,
    color: "#64748B",
  },
  googleButton: {
    alignSelf: "center",
  },
});

export default Login;
