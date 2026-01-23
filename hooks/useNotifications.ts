/**
 * useNotifications Hook
 * Manages push notification registration and handling
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/context/AuthContext';
import {
  notificationService,
  registerForPushNotifications,
  configureAndroidChannel,
} from '@/services/notifications';

interface UseNotificationsResult {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  isRegistering: boolean;
  error: string | null;
  registerForNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsResult {
  const { token: authToken, isAuthenticated, user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Register for push notifications
  const registerForNotifications = useCallback(async () => {
    if (!isAuthenticated || !authToken) {
      setError('Must be logged in to register for notifications');
      return;
    }

    // Check if user has notifications enabled
    if (user?.preferences?.notifications_enabled === false) {
      console.log('User has notifications disabled');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      // Configure Android channel
      if (Platform.OS === 'android') {
        await configureAndroidChannel();
      }

      // Get push token
      const token = await registerForPushNotifications();

      if (token) {
        setExpoPushToken(token);

        // Register with backend
        try {
          await notificationService.registerTokenWithBackend(authToken, token);
          console.log('Push token registered with backend');
        } catch (err) {
          console.error('Failed to register token with backend:', err);
          // Don't fail - local notifications will still work
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register for notifications');
      console.error('Notification registration error:', err);
    } finally {
      setIsRegistering(false);
    }
  }, [authToken, isAuthenticated, user?.preferences?.notifications_enabled]);

  // Set up listeners on mount
  useEffect(() => {
    // Listen for incoming notifications
    notificationListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listen for notification responses (user taps)
    responseListener.current = notificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);
        
        // Handle navigation based on notification data
        // Example: if (data.type === 'species') { router.push(`/detail/${data.speciesId}`); }
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Auto-register when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.preferences?.notifications_enabled !== false) {
      registerForNotifications();
    }
  }, [isAuthenticated, registerForNotifications]);

  return {
    expoPushToken,
    notification,
    isRegistering,
    error,
    registerForNotifications,
  };
}

export default useNotifications;
