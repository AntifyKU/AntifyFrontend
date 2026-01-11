import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AntCardProps {
    id: string;
    name: string;
    scientificName?: string;
    description?: string;
    image?: string;
    matchPercentage?: number;
    onPress?: () => void;
    variant?: 'horizontal' | 'vertical' | 'compact';
    showMatchPercentage?: boolean;
}

export default function AntCard({
    id,
    name,
    scientificName,
    description,
    image,
    matchPercentage,
    onPress,
    variant = 'vertical',
    showMatchPercentage = false,
}: AntCardProps) {
    const [imageError, setImageError] = useState(false);
    const showImage = image && !imageError;

    if (variant === 'horizontal') {
        return (
            <TouchableOpacity
                className="flex-row bg-[#e8f5e0] rounded-xl p-3 mb-3 items-center"
                onPress={onPress}
                activeOpacity={0.7}
            >
                {/* Thumbnail */}
                <View className="w-16 h-16 rounded-lg bg-[#d4e8c7] items-center justify-center mr-3 overflow-hidden">
                    {showImage ? (
                        <Image
                            source={{ uri: image }}
                            className="w-full h-full"
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <MaterialCommunityIcons name="image" size={28} color="#328e6e" />
                    )}
                </View>

                {/* Details */}
                <View className="flex-1">
                    <Text className="font-bold text-gray-800">{name}</Text>
                    {(description || scientificName) && (
                        <Text className="text-gray-500 text-sm" numberOfLines={1}>
                            {description || scientificName}
                        </Text>
                    )}
                    {showMatchPercentage && matchPercentage !== undefined && (
                        <Text className="text-[#0A9D5C] font-semibold text-sm">
                            {matchPercentage}% Match
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    if (variant === 'compact') {
        return (
            <TouchableOpacity
                className="w-[160px] mr-4"
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View className="bg-[#e8f5e0] rounded-xl overflow-hidden">
                    {showImage ? (
                        <Image
                            source={{ uri: image }}
                            className="h-28 w-full"
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View className="h-28 w-full bg-[#d4e8c7] items-center justify-center">
                            <MaterialCommunityIcons name="image" size={40} color="#328e6e" />
                        </View>
                    )}
                </View>
                <Text className="mt-2 font-semibold text-gray-800">{name}</Text>
                {scientificName && (
                    <Text className="text-gray-500 text-sm">{scientificName}</Text>
                )}
            </TouchableOpacity>
        );
    }

    // Default: vertical variant
    return (
        <TouchableOpacity
            className="bg-[#e8f5e0] rounded-xl overflow-hidden"
            onPress={onPress}
            activeOpacity={0.7}
        >
            {showImage ? (
                <Image
                    source={{ uri: image }}
                    className="h-40 w-full"
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View className="h-40 w-full bg-[#d4e8c7] items-center justify-center">
                    <MaterialCommunityIcons name="image" size={48} color="#328e6e" />
                </View>
            )}
            <View className="p-4">
                <Text className="text-lg font-semibold text-gray-800">{name}</Text>
                {(description || scientificName) && (
                    <Text className="text-gray-500" numberOfLines={2}>
                        {description || scientificName}
                    </Text>
                )}
                {showMatchPercentage && matchPercentage !== undefined && (
                    <Text className="text-[#0A9D5C] font-semibold mt-1">
                        {matchPercentage}% Match
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
