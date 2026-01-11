import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    activeColor?: string;
    inactiveColor?: string;
    readonly?: boolean;
}

export default function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    size = 36,
    activeColor = '#FFB800',
    inactiveColor = '#d4d6dd',
    readonly = false,
}: StarRatingProps) {
    const handlePress = (starNumber: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(starNumber);
        }
    };

    return (
        <View className="flex-row">
            {Array.from({ length: maxRating }, (_, index) => {
                const starNumber = index + 1;
                const isActive = rating >= starNumber;

                return (
                    <TouchableOpacity
                        key={starNumber}
                        onPress={() => handlePress(starNumber)}
                        disabled={readonly}
                        className="mr-2"
                        activeOpacity={readonly ? 1 : 0.7}
                    >
                        <Ionicons
                            name={isActive ? 'star' : 'star-outline'}
                            size={size}
                            color={isActive ? activeColor : inactiveColor}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
