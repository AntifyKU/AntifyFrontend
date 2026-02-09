import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '@/components/molecule/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
        redirect
      />
      <Tabs.Screen
        name="index-home"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore' }}
      />
      <Tabs.Screen
        name="news"
        options={{ title: 'News' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
      <Tabs.Screen
        name="collection"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="information"
        options={{ href: null }}
      />
    </Tabs>
  );
}
