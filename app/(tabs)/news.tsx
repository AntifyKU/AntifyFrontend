import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    Linking,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import ListCard from '@/components/ListCard';

export default function NewsScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // News data
    const newsItems = [
        {
            id: '1',
            title: 'Extraordinary fossil reveals the oldest ant species known to science',
            description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
            link: 'https://edition.cnn.com/2025/04/24/science/fossil-oldest-known-ant/index.html',
            image: 'https://media.cnn.com/api/v1/images/stellar/prod/ant-fossil-photograph-credit-anderson-lepeco.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp'
        },
        {
            id: '2',
            title: 'Spread of Australia\'s red fire ant population has sent 23 people to hospital',
            description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
            link: 'https://edition.cnn.com/2025/03/24/science/australia-fire-ants-spread-intl-scli/index.html',
            image: 'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1465224290.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp'
        },
        {
            id: '3',
            title: 'New ant species discovered in the Amazon rainforest',
            description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
            link: 'https://www.nationalgeographic.com',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ants_on_the_ground.jpg/1280px-Ants_on_the_ground.jpg'
        },
        {
            id: '4',
            title: 'Scientists study ant colonies to improve AI algorithms',
            description: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
            link: 'https://www.sciencedaily.com',
            image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Ant_feeding_on_honey.jpg'
        },
    ];

    const handleNewsPress = async (newsUrl: string) => {
        try {
            await WebBrowser.openBrowserAsync(newsUrl);
        } catch (error) {
            console.error("Error opening URL:", error);
            const canOpen = await Linking.canOpenURL(newsUrl);
            if (canOpen) {
                await Linking.openURL(newsUrl);
            } else {
                Alert.alert("Cannot open URL", "The link cannot be opened.");
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="relative flex-row items-center justify-center px-5 pt-4 pb-4">
                <Text className="text-xl font-semibold text-gray-800">News</Text>
                <TouchableOpacity className="absolute right-5">
                    <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="px-5 mb-3">
                    <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-full">
                        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-2 text-base text-gray-700"
                            placeholder="Search news..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Sort Button */}
                <View className="flex-row justify-end px-5 mb-4">
                    <TouchableOpacity className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
                        <Ionicons name="swap-vertical-outline" size={18} color="#374151" />
                        <Text className="ml-1 font-medium text-gray-700">Sort</Text>
                        <Ionicons name="chevron-down" size={16} color="#374151" className="ml-1" />
                    </TouchableOpacity>
                </View>

                {/* News List */}
                <View className="px-5">
                    {newsItems.map((news) => (
                        <ListCard
                            key={news.id}
                            id={news.id}
                            title={news.title}
                            description={news.description}
                            image={news.image}
                            onPress={() => handleNewsPress(news.link)}
                            showChevron={false}
                        />
                    ))}
                </View>

                {/* Bottom padding for tab bar */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}

