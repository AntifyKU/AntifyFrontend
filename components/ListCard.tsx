import { View, Text, Image, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

interface ListCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  onPress?: () => void;
  onDelete?: () => void;
  showChevron?: boolean;
}

export default function ListCard({
  title,
  description,
  image,
  onPress,
  onDelete,
  showChevron = false,
}: ListCardProps) {
  const [imageError, setImageError] = useState(false);

  const Card = (
    <View className="mb-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
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
          <Text
            className="text-lg font-semibold text-gray-800"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-gray-500 text-sm" numberOfLines={2}>
            {description}
          </Text>
        </View>

        {showChevron && (
          <View className="justify-center pr-4">
            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
  if (!onDelete) return Card;
  return (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          onPress={onDelete}
          className="w-20 bg-red-500 items-center justify-center"
        >
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      )}
    >
      {Card}
    </Swipeable>
  );
}
