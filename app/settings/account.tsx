/**
 * Account Settings Screen
 * Allows users to edit their profile information
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';
import TextInput from '@/components/TextInput';

export default function AccountSettingsScreen() {
  const { user, token, refreshUser } = useAuth();
  
  // Form states
  const [username, setUsername] = useState(user?.username || '');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading states
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Validation errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateUsername = async () => {
    if (!token) return;
    
    // Validate
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }
    if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    if (username === user?.username) {
      setUsernameError('Username is the same as current');
      return;
    }
    
    setUsernameError('');
    setIsUpdatingUsername(true);
    
    try {
      await authService.updateProfile(token, { username: username.trim() });
      await refreshUser();
      Alert.alert('Success', 'Username updated successfully!');
    } catch (error: any) {
      setUsernameError(error.message || 'Failed to update username');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!token) return;
    
    // Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError('Invalid email format');
      return;
    }
    if (newEmail === user?.email) {
      setEmailError('Email is the same as current');
      return;
    }
    
    setEmailError('');
    setIsUpdatingEmail(true);
    
    try {
      await authService.changeEmail(token, newEmail.trim());
      await refreshUser();
      setNewEmail('');
      Alert.alert('Success', 'Email updated successfully!');
    } catch (error: any) {
      setEmailError(error.message || 'Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!token) return;
    
    // Validate
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setIsUpdatingPassword(true);
    
    try {
      await authService.changePassword(token, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      Alert.alert('Success', 'Password updated successfully!');
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#22A45D" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-800 text-center mr-7">
          Account Settings
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Username Section */}
          <View className="py-6 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Username</Text>
            <TextInput
              placeholder="Enter new username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
              icon="person-outline"
              error={usernameError}
              autoCapitalize="none"
            />
            <TouchableOpacity
              className={`mt-4 py-3 rounded-lg items-center ${
                isUpdatingUsername ? 'bg-gray-300' : 'bg-[#22A45D]'
              }`}
              onPress={handleUpdateUsername}
              disabled={isUpdatingUsername}
            >
              {isUpdatingUsername ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Update Username</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Email Section */}
          <View className="py-6 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Email</Text>
            <Text className="text-gray-500 mb-4">Current: {user?.email}</Text>
            <TextInput
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={(text) => {
                setNewEmail(text);
                setEmailError('');
              }}
              icon="mail-outline"
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              className={`mt-4 py-3 rounded-lg items-center ${
                isUpdatingEmail ? 'bg-gray-300' : 'bg-[#22A45D]'
              }`}
              onPress={handleUpdateEmail}
              disabled={isUpdatingEmail}
            >
              {isUpdatingEmail ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Update Email</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Password Section */}
          <View className="py-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Change Password</Text>
            <TextInput
              placeholder="New password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError('');
              }}
              icon="lock-closed-outline"
              secureTextEntry
              error={passwordError && !confirmPassword ? passwordError : undefined}
            />
            <View className="h-3" />
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError('');
              }}
              icon="lock-closed-outline"
              secureTextEntry
              error={passwordError}
            />
            <TouchableOpacity
              className={`mt-4 py-3 rounded-lg items-center ${
                isUpdatingPassword ? 'bg-gray-300' : 'bg-[#22A45D]'
              }`}
              onPress={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View className="py-6 mb-10">
            <Text className="text-lg font-semibold text-red-500 mb-4">Danger Zone</Text>
            <TouchableOpacity
              className="py-3 border-2 border-red-500 rounded-lg items-center"
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to delete your account? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: () => {
                        // TODO: Implement account deletion
                        Alert.alert('Coming Soon', 'Account deletion will be available in a future update.');
                      }
                    }
                  ]
                );
              }}
            >
              <Text className="text-red-500 font-semibold">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
