import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Custom tab bar component
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  // Colors
  const activeColor = '#FFFFFF';
  const inactiveColor = 'rgba(255, 255, 255, 0.7)';
  
  return (
    <View 
      style={{ 
        flexDirection: 'row',
        backgroundColor: '#0A9D5C',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 65 + insets.bottom,
        paddingBottom: insets.bottom,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        width: width,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title || route.name;
        const isFocused = state.index === index;
        
        // Skip the index route which is just a redirect
        if (route.name === 'index') return null;
        
        // Get the icon name based on the route
        let iconName: keyof typeof Ionicons.glyphMap | undefined;
        if (route.name === 'explore') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'collection') {
          iconName = isFocused ? 'folder' : 'folder-outline';
        } else if (route.name === 'information') {
          iconName = isFocused ? 'information-circle' : 'information-circle-outline';
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
              paddingTop: 10,
              backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            <Ionicons 
              name={iconName || 'help-circle-outline'} 
              size={24} 
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
      })}
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
        name="explore"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          title: 'Information',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}