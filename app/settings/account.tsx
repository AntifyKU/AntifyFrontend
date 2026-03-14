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
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import TextInput from "@/components/atom/TextInput";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";

type MenuScreen = "main" | "username" | "email" | "password";

export default function AccountSettingsScreen() {
  const { user, token, refreshUser, logout } = useAuth();
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>("main");

  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
      setUsernameError(t("account.username.errorRequired"));
      return;
    }
    if (newUsername.trim().length < 3) {
      setUsernameError(t("account.username.errorTooShort"));
      return;
    }
    if (newUsername === user?.username) {
      setUsernameError(t("account.username.errorSame"));
      return;
    }

    setUsernameError("");
    setIsUpdatingUsername(true);
    try {
      await authService.updateProfile(token, { username: newUsername.trim() });
      await refreshUser();
      Alert.alert(t("common.success"), t("account.username.successMessage"));
      setCurrentScreen("main");
    } catch (error: any) {
      setUsernameError(error.message || t("account.username.errorFailed"));
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!token) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      setEmailError(t("account.email.errorRequired"));
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError(t("account.email.errorInvalid"));
      return;
    }
    if (newEmail === user?.email) {
      setEmailError(t("account.email.errorSame"));
      return;
    }

    setEmailError("");
    setIsUpdatingEmail(true);
    try {
      await authService.changeEmail(token, newEmail.trim());
      await refreshUser();
      setNewEmail("");
      Alert.alert(t("common.success"), t("account.email.successMessage"));
      setCurrentScreen("main");
    } catch (error: any) {
      setEmailError(error.message || t("account.email.errorFailed"));
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!token) return;

    if (!newPassword) {
      setPasswordError(t("account.password.errorRequired"));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t("account.password.errorTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("account.password.errorMismatch"));
      return;
    }

    setPasswordError("");
    setIsUpdatingPassword(true);
    try {
      await authService.changePassword(token, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert(t("common.success"), t("account.password.successMessage"));
      setCurrentScreen("main");
    } catch (error: any) {
      setPasswordError(error.message || t("account.password.errorFailed"));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    try {
      await authService.deleteAccount(token);
      Alert.alert(
        t("common.success"),
        t("account.deleteAccount.successMessage"),
      );
      logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert(
        t("common.error"),
        error.message || t("account.deleteAccount.errorMessage"),
      );
    }
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-4">
        <MenuItem
          icon="person-outline"
          title={t("account.menu.username.title")}
          description={t("account.menu.username.description")}
          onPress={() => setCurrentScreen("username")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="mail-outline"
          title={t("account.menu.email.title")}
          description={t("account.menu.email.description")}
          onPress={() => setCurrentScreen("email")}
          iconColor="#22A45D"
        />
        <MenuItem
          icon="lock-closed-outline"
          title={t("account.menu.password.title")}
          description={t("account.menu.password.description")}
          onPress={() => setCurrentScreen("password")}
          iconColor="#22A45D"
        />

        <View className="mt-8 mb-6">
          <PrimaryButton
            title={t("account.deleteAccount.button")}
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
                t("account.deleteAccount.confirmTitle"),
                t("account.deleteAccount.confirmMessage"),
                [
                  { text: t("common.cancel"), style: "cancel" },
                  {
                    text: t("common.delete"),
                    style: "destructive",
                    onPress: () => {
                      void handleDeleteAccount();
                    },
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
          <Text className="text-lg text-gray-500 mb-2">
            {t("account.username.currentLabel")}
          </Text>
          <Text className="text-base font-semibold text-gray-800 mb-6">
            {user?.username}
          </Text>

          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {t("account.username.newLabel")}
          </Text>

          <TextInput
            placeholder={t("account.username.placeholder")}
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
            title={
              isUpdatingUsername
                ? t("common.updatingButton")
                : t("account.username.updateButton")
            }
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
          <Text className="text-lg text-gray-500 mb-2">
            {t("account.email.currentLabel")}
          </Text>
          <Text className="text-base font-semibold text-gray-800 mb-6">
            {user?.email}
          </Text>

          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {t("account.email.newLabel")}
          </Text>

          <TextInput
            placeholder={t("account.email.placeholder")}
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
            title={
              isUpdatingEmail
                ? t("common.updatingButton")
                : t("account.email.updateButton")
            }
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
            {t("account.password.newLabel")}
          </Text>

          <TextInput
            placeholder={t("account.password.newPlaceholder")}
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
            placeholder={t("account.password.confirmPlaceholder")}
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
            title={
              isUpdatingPassword
                ? t("common.updatingButton")
                : t("account.password.updateButton")
            }
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
        return t("account.username.screenTitle");
      case "email":
        return t("account.email.screenTitle");
      case "password":
        return t("account.password.screenTitle");
      default:
        return t("account.title");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

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

      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "username" && renderUsernameForm()}
      {currentScreen === "email" && renderEmailForm()}
      {currentScreen === "password" && renderPasswordForm()}
    </SafeAreaView>
  );
}
