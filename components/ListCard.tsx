import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ListCardProps {
    id: string;
    title: string;
    description: string;
    image?: string;
    onPress?: () => void;
    showChevron?: boolean;
    variant?: 'yellow' | 'white';
}

export default function ListCard({
    id,
    title,
    description,
    image,
    onPress,
    showChevron = false,
    variant = 'yellow',
}: ListCardProps) {
    const [imageError, setImageError] = useState(false);

    const showImage = image && !imageError;

    return (
        <TouchableOpacity
            className="flex-row mb-4 overflow-hidden bg-white border border-gray-200 rounded-xl"
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image placeholder */}
            <View className="bg-[#e1eebc] w-28 self-stretch items-center justify-center overflow-hidden relative">
                {showImage ? (
                    <Image
                        source={{ uri: image }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Ionicons name="image" size={32} color="#328e6e" />
                )}
            </View>

            {/* Content */}
            <View className="flex-1 p-4 justify-center">
                <Text
                    className="text-lg font-semibold text-gray-800 mb-1"
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text
                    className="text-gray-500 text-sm leading-5"
                    numberOfLines={2}
                >
                    {description}
                </Text>
            </View>

            {/* Chevron */}
            {showChevron && (
                <View className="justify-center pr-4">
                    <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
                </View>
            )}
        </TouchableOpacity>
    );
}
