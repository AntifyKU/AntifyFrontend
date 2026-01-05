import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { InputField } from "../../components/molecule/InputField";
import { Button } from "../../components/atom/Button";
import { GoogleButton } from "@/components/atom/GoogleButton";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleLogin = () => {
    const newErrors: {
      username?: string;
      password?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = "Please enter username or email";
    }

    if (!password.trim()) {
      newErrors.password = "Please enter password";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("Login pressed", { username, password });
  };

  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
  };

  const handleSignUp = () => {
    console.log("Sign up pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
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

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Log in"
              onPress={handleLogin}
              variant="primary"
              style={styles.loginButton}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Not a member? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign up now</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.googleButton}>
              <GoogleButton onPress={handleGoogleLogin} />
            </TouchableOpacity>
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

export default LoginPage;
