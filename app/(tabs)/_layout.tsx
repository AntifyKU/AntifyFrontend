import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Custom tab bar component

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Colors
  const activeColor = '#22A45D';
  const inactiveColor = '#6B7280';

  // Define the tab order (excluding hidden routes)
  const visibleRoutes = state.routes.filter(
    route => !['index', 'collection', 'information'].includes(route.name)
  );

  // Find indices for left tabs (Home, Explore) and right tabs (News, Profile)
  const leftTabs = visibleRoutes.slice(0, 2);
  const rightTabs = visibleRoutes.slice(2, 4);

  const renderTab = (route: typeof state.routes[0], index: number) => {
    const { options } = descriptors[route.key];
    const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title || route.name;
    const routeIndex = state.routes.findIndex(r => r.key === route.key);
    const isFocused = state.index === routeIndex;

    // Get the icon name based on the route
    let iconName: keyof typeof Ionicons.glyphMap | undefined;
    if (route.name === 'index-home') {
      iconName = isFocused ? 'home' : 'home-outline';
    } else if (route.name === 'explore') {
      iconName = isFocused ? 'compass' : 'compass-outline';
    } else if (route.name === 'news') {
      iconName = isFocused ? 'newspaper' : 'newspaper-outline';
    } else if (route.name === 'profile') {
      iconName = isFocused ? 'person' : 'person-outline';
    }

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 12,
        }}
      >
        <Ionicons
          name={iconName || 'help-circle-outline'}
          size={26}
          color={isFocused ? activeColor : inactiveColor}
          style={{ marginBottom: 4 }}
        />

        <Text
          style={{
            color: isFocused ? activeColor : inactiveColor,
            fontSize: 12,
            fontWeight: isFocused ? '600' : '400',
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Handle camera photo
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission to use this feature."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        router.push({
          pathname: '/detail/[id]',
          params: { id: 'new', imageUri: capturedImage.uri, source: 'camera' }
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "There was a problem taking the photo. Please try again.");
    }
  };

  // Handle upload photo from gallery
  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "You need to grant gallery access to use this feature."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        router.push({
          pathname: '/detail/[id]',
          params: { id: 'new', imageUri: selectedImage.uri, source: 'gallery' }
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "There was a problem selecting the photo. Please try again.");
    }
  };

  // Handle camera button press - show action sheet
  const handleCameraButtonPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handleUploadPhoto();
          }
        }
      );
    } else {
      Alert.alert(
        'Identify Ant',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: handleTakePhoto },
          { text: 'Choose from Gallery', onPress: handleUploadPhoto },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: width,
      }}
    >
      {/* Floating Camera Button */}
      <View
        style={{
          position: 'absolute',
          top: -30,
          left: width / 2 - 35,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCameraButtonPress}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#22A45D',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#22A45D',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="camera" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 10,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }}
      >
        {/* Left Tabs */}
        <View style={{ flex: 2, flexDirection: 'row' }}>
          {leftTabs.map((route, index) => renderTab(route, index))}
        </View>

        {/* Center Space for Camera Button */}
        <View style={{ width: 80 }} />

        {/* Right Tabs */}
        <View style={{ flex: 2, flexDirection: 'row' }}>
          {rightTabs.map((route, index) => renderTab(route, index))}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
        redirect={true}
      />
      <Tabs.Screen
        name="index-home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          href: null,
        }}
      />
    </Tabs>

  );
}