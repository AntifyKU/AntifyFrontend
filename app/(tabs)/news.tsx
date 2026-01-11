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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import ListCard from '@/components/ListCard';
import SearchBar from '@/components/SearchBar';
import SortButton from '@/components/SortButton';
import { newsData } from '@/constants/AntData';

export default function NewsScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter news based on search query
    const filteredNews = newsData.filter(item => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    });

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
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search news..."
                    containerClassName="px-5 mb-3"
                    showBorder={false}
                />

                {/* Sort Button */}
                <View className="flex-row justify-end px-5 mb-4">
                    <SortButton onPress={() => { }} />
                </View>

                {/* News List */}
                <View className="px-5">
                    {filteredNews.map((news) => (
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
