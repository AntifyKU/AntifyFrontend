import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

interface ListCardProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image?: string;
  readonly onPress?: () => void;
  readonly onLongPress?: () => void;
  readonly onDelete?: () => void;
  readonly onMore?: () => void;
  readonly showChevron?: boolean;
  readonly badge?: React.ReactNode;
}

export default function ListCard({
  id,
  title,
  description,
  image,
  onPress,
  onLongPress,
  onDelete,
  onMore,
  showChevron = false,
  badge,
}: ListCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <View className="mb-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={onLongPress}
        className="flex-row overflow-hidden bg-white border border-gray-200 rounded-xl"
      >
        {/* image */}
        <View className="bg-[#e1eebc] w-28 self-stretch items-center justify-center relative">
          {image && !imageError && (
            <Image
              source={{ uri: image }}
              style={{ position: "absolute", inset: 0 }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}
        </View>

        {/* content */}
        <View className="flex-1 p-4 justify-center">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-lg font-semibold text-gray-800 flex-1"
              numberOfLines={1}
            >
              {title}
            </Text>
            {badge && <View className="ml-2">{badge}</View>}
          </View>
          <Text className="text-gray-500 text-sm" numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* More button */}
        {onMore && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onMore();
            }}
            className="justify-center items-center w-12"
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}

        {/* Delete button */}
        {onDelete && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="justify-center items-center w-12 bg-red-50"
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}

        {/* Chevron */}
        {showChevron && !onDelete && (
          <View className="justify-center pr-4">
            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
