import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const defaultItemWidth = (width - 40 - gap) / numColumns;

interface CollectionGridItemProps {
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    onPress?: () => void;
    itemWidth?: number;
    isLeftColumn?: boolean;
}

export default function CollectionGridItem({
    id,
    title,
    subtitle,
    image,
    onPress,
    itemWidth = defaultItemWidth,
    isLeftColumn = true,
}: CollectionGridItemProps) {
    const [imageError, setImageError] = useState(false);
    const showImage = image && !imageError;

    return (
        <TouchableOpacity
            style={{
                width: itemWidth,
                marginBottom: 16,
                marginLeft: isLeftColumn ? 0 : gap,
            }}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="bg-[#e1eebc] rounded-xl overflow-hidden aspect-square items-center justify-center">
                {showImage ? (
                    <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Ionicons name="image" size={48} color="#328e6e" />
                )}
            </View>
            <Text className="mt-2 text-base font-semibold text-gray-800">{title}</Text>
            {subtitle && (
                <Text className="text-sm text-gray-500">{subtitle}</Text>
            )}
        </TouchableOpacity>
    );
}

// Export utility function for calculating item width
export function getGridItemWidth(containerPadding: number = 40, columnGap: number = 12, columns: number = 2): number {
    return (width - containerPadding - columnGap * (columns - 1)) / columns;
}
