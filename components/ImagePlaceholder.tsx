import React from 'react';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ImagePlaceholderProps {
    size?: 'small' | 'medium' | 'large' | 'full';
    iconSize?: number;
    backgroundColor?: string;
    iconColor?: string;
    className?: string;
    aspectRatio?: 'square' | '4:3' | '16:9';
}

export default function ImagePlaceholder({
    size = 'medium',
    iconSize,
    backgroundColor = '#e8f5e0',
    iconColor = '#328e6e',
    className = '',
    aspectRatio = 'square',
}: ImagePlaceholderProps) {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-28 h-28',
        full: 'w-full',
    };

    const defaultIconSizes = {
        small: 20,
        medium: 32,
        large: 48,
        full: 64,
    };

    const aspectRatioClasses = {
        square: 'aspect-square',
        '4:3': 'aspect-[4/3]',
        '16:9': 'aspect-video',
    };

    const computedIconSize = iconSize || defaultIconSizes[size];
    const sizeClass = size === 'full'
        ? `${sizeClasses[size]} ${aspectRatioClasses[aspectRatio]}`
        : sizeClasses[size];

    return (
        <View
            className={`rounded-lg items-center justify-center ${sizeClass} ${className}`}
            style={{ backgroundColor }}
        >
            <MaterialCommunityIcons
                name="image"
                size={computedIconSize}
                color={iconColor}
            />
        </View>
    );
}
