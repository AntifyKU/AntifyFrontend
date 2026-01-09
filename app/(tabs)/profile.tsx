import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ListCard from '@/components/ListCard';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const itemWidth = (width - 40 - gap) / numColumns;

type TabType = 'collection' | 'favorite';

// Sample collection data
const collectionItems = [
  { id: '1', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
  { id: '2', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
  { id: '3', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
  { id: '4', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
  { id: '5', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
  { id: '6', title: 'Porem ipsum', subtitle: 'Worem ipsum' },
];

const favoriteItems = [
  { id: '1', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '2', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '3', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '4', title: 'Worem ipsum', description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.' },
];

// Settings menu items
const settingsMenuItems = [
  { id: '1', title: 'Account', icon: 'person-outline' as const },
  { id: '2', title: 'App Preferences', icon: 'globe-outline' as const },
  { id: '3', title: 'Privacy & Security', icon: 'shield-outline' as const },
  { id: '4', title: 'Support & Info', icon: 'help-circle-outline' as const },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [showSettings, setShowSettings] = useState(false);

  const handleItemPress = (id: string) => {
    router.push({
      pathname: '/detail',
      params: { id }
    });
  };

  // Render collection grid item
  const renderCollectionItem = (item: typeof collectionItems[0], index: number) => {
    const isLeftColumn = index % 2 === 0;

    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemWidth,
          marginBottom: 16,
          marginLeft: isLeftColumn ? 0 : gap,
        }}
        onPress={() => handleItemPress(item.id)}
      >
        <View className="bg-[#e1eebc] rounded-xl overflow-hidden aspect-square items-center justify-center">
          <Ionicons name="image" size={48} color="#328e6e" />
        </View>
        <Text className="mt-2 text-base font-semibold text-gray-800">{item.title}</Text>
        <Text className="text-sm text-gray-500">{item.subtitle}</Text>
      </TouchableOpacity>
    );
  };



  // Settings Modal
  const SettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row items-center justify-center px-5 py-4">
          <TouchableOpacity
            className="absolute left-5"
            onPress={() => setShowSettings(false)}
          >
            <Ionicons name="chevron-back" size={28} color="#22A45D" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">Setting</Text>
        </View>

        {/* Profile Section */}
        <View className="items-center py-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full bg-[#c5e063] items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-[#328e6e] items-center justify-center">
                <Ionicons name="person" size={40} color="#c5e063" />
              </View>
            </View>
            {/* Edit button on avatar */}
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22A45D] items-center justify-center">
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-800">Username</Text>
          <Text className="mt-1 text-gray-500">email address</Text>
        </View>

        {/* Divider */}
        <View className="h-px mx-5 bg-gray-200" />

        {/* Menu Items */}
        <View className="px-5 mt-4">
          {settingsMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <Ionicons name={item.icon} size={24} color="#6B7280" />
              <Text className="flex-1 ml-4 text-base text-gray-800">{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Settings Modal */}
      <SettingsModal />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="w-10" />
        <Text className="text-xl font-semibold text-gray-800">Profile</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View className="items-center py-6">
          <View className="w-28 h-28 rounded-full bg-[#c5e063] items-center justify-center mb-4">
            <View className="w-20 h-20 rounded-full bg-[#328e6e] items-center justify-center">
              <Ionicons name="person" size={40} color="#c5e063" />
            </View>
          </View>
          <Text className="text-xl font-bold text-gray-800">Username</Text>
          <Text className="mt-1 text-gray-500">email address</Text>
        </View>

        {/* Tab Switcher */}
        <View className="mx-5 mb-4">
          <View className="flex-row p-1 bg-gray-100 rounded-full">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${activeTab === 'collection' ? 'bg-[#22A45D]' : ''}`}
              onPress={() => setActiveTab('collection')}
            >
              <Text className={`text-center font-medium ${activeTab === 'collection' ? 'text-white' : 'text-gray-500'}`}>
                Collection
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${activeTab === 'favorite' ? 'bg-[#22A45D]' : ''}`}
              onPress={() => setActiveTab('favorite')}
            >
              <Text className={`text-center font-medium ${activeTab === 'favorite' ? 'text-white' : 'text-gray-500'}`}>
                Favorite
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sort and Edit Buttons */}
        <View className="flex-row items-center justify-between px-5 mb-4">
          {activeTab === 'collection' ? (
            <>
              {/* Sort on left for Collection */}
              <TouchableOpacity className="flex-row items-center px-3 py-2 border border-gray-200 rounded-lg">
                <Ionicons name="swap-vertical" size={16} color="#333" />
                <Text className="ml-2 text-gray-700">Sort</Text>
                <Ionicons name="chevron-down" size={16} color="#333" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              {/* Edit button */}
              <TouchableOpacity className="px-4 py-2 border border-[#22A45D] rounded-lg">
                <Text className="text-[#22A45D] font-medium">Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Empty space for Favorite */}
              <View />
              {/* Sort on right for Favorite */}
              <TouchableOpacity className="flex-row items-center px-3 py-2 border border-gray-200 rounded-lg">
                <Ionicons name="swap-vertical" size={16} color="#333" />
                <Text className="ml-2 text-gray-700">Sort</Text>
                <Ionicons name="chevron-down" size={16} color="#333" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Content based on active tab */}
        <View className="px-5">
          {activeTab === 'collection' ? (
            // Collection Grid
            <View className="flex-row flex-wrap">
              {collectionItems.map((item, index) => renderCollectionItem(item, index))}
            </View>
          ) : (
            // Favorite List
            <>
              {favoriteItems.map(item => (
                <ListCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  onPress={() => handleItemPress(item.id)}
                />
              ))}
            </>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}