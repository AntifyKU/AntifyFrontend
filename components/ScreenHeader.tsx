import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ScreenHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightActions?: React.ReactNode;
    centerTitle?: boolean;
    backgroundColor?: string;
}

export default function ScreenHeader({
    title,
    showBackButton = true,
    onBackPress,
    rightActions,
    centerTitle = true,
    backgroundColor = 'white',
}: ScreenHeaderProps) {
    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView edges={['top']} style={{ backgroundColor }}>
                <View className="flex-row items-center justify-between px-4 py-3">
                    {/* Left side - Back button or spacer */}
                    {showBackButton ? (
                        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                            <Ionicons name="chevron-back" size={28} color="#0A9D5C" />
                        </TouchableOpacity>
                    ) : (
                        <View className="w-10" />
                    )}

                    {/* Title */}
                    <Text
                        className={`text-xl font-bold text-gray-800 ${centerTitle ? 'flex-1 text-center' : ''}`}
                        style={centerTitle ? { marginRight: showBackButton ? 0 : 40 } : {}}
                    >
                        {title}
                    </Text>

                    {/* Right side - Actions or spacer */}
                    {rightActions ? (
                        <View className="flex-row items-center">{rightActions}</View>
                    ) : (
                        <View className="w-10" />
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}
