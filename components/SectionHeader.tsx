import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    showSeeMore?: boolean;
    onSeeMorePress?: () => void;
    seeMoreText?: string;
    containerClassName?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    showSeeMore = false,
    onSeeMorePress,
    seeMoreText = "See more",
    containerClassName = "px-5 mb-3",
}: SectionHeaderProps) {
    return (
        <View className={`flex-row items-center justify-between ${containerClassName}`}>
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">{title}</Text>
                {subtitle && (
                    <Text className="text-gray-500 text-sm">{subtitle}</Text>
                )}
            </View>
            {showSeeMore && onSeeMorePress && (
                <TouchableOpacity onPress={onSeeMorePress}>
                    <Text className="text-[#328e6e] font-medium">{seeMoreText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
