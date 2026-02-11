import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import TextInput from "@/components/atom/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";

type MenuScreen = "main" | "username" | "email" | "password";

export default function AccountSettingsScreen() {
  const { user, token, refreshUser, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>("main");

  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading states
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Validation errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUpdateUsername = async () => {
    if (!token) return;

    if (!newUsername.trim()) {
      setUsernameError("Username is required");
      return;
    }
    if (newUsername.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    if (newUsername === user?.username) {
      setUsernameError("Username is the same as current");
      return;
    }

    setUsernameError("");
    setIsUpdatingUsername(true);

    try {
      await authService.updateProfile(token, { username: newUsername.trim() });
      await refreshUser();
      Alert.alert("Success", "Username updated successfully!");
      setCurrentScreen("main");
    } catch (error: any) {
      setUsernameError(error.message || "Failed to update username");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!token) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError("Invalid email format");
      return;
    }
    if (newEmail === user?.email) {
      setEmailError("Email is the same as current");
      return;
    }

    setEmailError("");
    setIsUpdatingEmail(true);

    try {
      await authService.changeEmail(token, newEmail.trim());
      await refreshUser();
      setNewEmail("");
      Alert.alert("Success", "Email updated successfully!");
      setCurrentScreen("main");
    } catch (error: any) {
      setEmailError(error.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!token) return;

    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setIsUpdatingPassword(true);

    try {
      await authService.changePassword(token, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      Alert.alert("Success", "Password updated successfully!");
      setCurrentScreen("main");
    } catch (error: any) {
      setPasswordError(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;

    try {
      await authService.deleteAccount(token);
      Alert.alert("Success", "Your account has been deleted!");
      logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete account");
    }
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-4">
        <MenuItem
          icon="person-outline"
          title="Username"
          description="Manage your account username"
          onPress={() => setCurrentScreen("username")}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="mail-outline"
          title="Email"
          description="Manage your email address"
          onPress={() => setCurrentScreen("email")}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="lock-closed-outline"
          title="Change Password"
          description="Update your password"
          onPress={() => setCurrentScreen("password")}
          iconColor="#22A45D"
        />

        <View className="mt-8 mb-6">
          <PrimaryButton
            title="Delete Account"
            iconType="ant"
            icon="user-delete"
            size="large"
            variant="outlined"
            style={{
              backgroundColor: "#EF4444",
              borderColor: "#EF4444",
              borderWidth: 0,
              borderRadius: 12,
            }}
            textStyle={{ color: "#FFFFFF", fontWeight: "600" }}
            iconColor="#FFFFFF"
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "Are you sure you want to delete your account? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDeleteAccount,
                  },
                ],
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderUsernameForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className="text-lg text-gray-500 mb-2">Current username</Text>
          <Text className="text-base font-semibold text-gray-800 mb-6">
            {user?.username}
          </Text>

          <Text className="text-lg font-semibold text-gray-800 mb-4">
            New username
          </Text>

          <TextInput
            placeholder="Enter new username"
            value={newUsername}
            onChangeText={(text) => {
              setNewUsername(text);
              setUsernameError("");
            }}
            icon="person-outline"
            error={usernameError}
            autoCapitalize="none"
          />

          <PrimaryButton
            title={isUpdatingUsername ? "Updating..." : "Update Username"}
            onPress={handleUpdateUsername}
            disabled={isUpdatingUsername}
            size="large"
            style={{
              marginTop: 24,
              shadowColor: "transparent",
              elevation: 0,
              borderRadius: 12,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderEmailForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className="text-lg text-gray-500 mb-2">Current email</Text>
          <Text className="text-base font-semibold text-gray-800 mb-6">
            {user?.email}
          </Text>

          <Text className="text-lg font-semibold text-gray-800 mb-4">
            New email
          </Text>

          <TextInput
            placeholder="Enter new email"
            value={newEmail}
            onChangeText={(text) => {
              setNewEmail(text);
              setEmailError("");
            }}
            icon="mail-outline"
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <PrimaryButton
            title={isUpdatingEmail ? "Updating..." : "Update Email"}
            onPress={handleUpdateEmail}
            disabled={isUpdatingEmail}
            size="large"
            style={{
              marginTop: 24,
              shadowColor: "transparent",
              elevation: 0,
              borderRadius: 12,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderPasswordForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            New password
          </Text>

          <TextInput
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setPasswordError("");
            }}
            icon="lock-closed-outline"
            isPassword
            error={
              passwordError && !confirmPassword ? passwordError : undefined
            }
          />

          <View className="h-3" />

          <TextInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setPasswordError("");
            }}
            icon="lock-closed-outline"
            isPassword
            error={passwordError}
          />

          <PrimaryButton
            title={isUpdatingPassword ? "Updating..." : "Update Password"}
            onPress={handleUpdatePassword}
            disabled={isUpdatingPassword}
            size="large"
            style={{
              marginTop: 24,
              shadowColor: "transparent",
              elevation: 0,
              borderRadius: 12,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "username":
        return "Username";
      case "email":
        return "Email";
      case "password":
        return "Change Password";
      default:
        return "Account Settings";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="py-6">
        <ScreenHeader
          title={getScreenTitle()}
          leftIcon="chevron-back"
          onLeftPress={() => {
            if (currentScreen === "main") {
              router.back();
            } else {
              setCurrentScreen("main");
              setUsernameError("");
              setEmailError("");
              setPasswordError("");
            }
          }}
        />
      </View>

      {/* Content */}
      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "username" && renderUsernameForm()}
      {currentScreen === "email" && renderEmailForm()}
      {currentScreen === "password" && renderPasswordForm()}
    </SafeAreaView>
  );
}
