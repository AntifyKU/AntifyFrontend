import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BaseCardItemProps {
  name: string;
  accentColor: string;
  onPress: () => void;
  onMore?: () => void;
  showMore?: boolean;
  backgroundColor?: string;
  isTopic?: boolean;
}

interface FolderCardItemProps extends BaseCardItemProps {
  variant: "folder";
  itemCount?: number;
}

interface SpeciesCardItemProps extends BaseCardItemProps {
  variant: "species";
  scientificName?: string;
  imageUri?: string;
}

export type CardItemProps = FolderCardItemProps | SpeciesCardItemProps;

export default function CardItem(props: CardItemProps) {
  const {
    name,
    accentColor,
    onPress,
    onMore,
    showMore = true,
    backgroundColor = "#f9fafb",
    isTopic = false,
  } = props;

  const [imageError, setImageError] = useState(false);
  const isSpecies = props.variant === "species";
  const imageUri = isSpecies ? props.imageUri : undefined;
  const showImage = isSpecies && !!imageUri && !imageError;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="rounded-2xl overflow-hidden border border-gray-100"
      style={{
        backgroundColor,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View
        className="h-28 w-full items-center justify-center overflow-hidden"
        style={showImage ? undefined : { backgroundColor: accentColor + "22" }}
      >
        {showImage ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: accentColor + "33",
            }}
          >
            <Text className="text-2xl font-bold" style={{ color: accentColor }}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View
        className={`px-3 py-3 ${isTopic ? "ml-3 mr-3" : "ml-3"}`}
        style={isTopic ? { height: 50, justifyContent: "center" } : undefined}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text
              className="font-bold text-gray-900 text-base"
              numberOfLines={isTopic ? 2 : 1}
            >
              {name}
            </Text>

            {isSpecies ? (
              <Text className="text-sm text-gray-500 italic" numberOfLines={1}>
                {props.scientificName}
              </Text>
            ) : (
              <Text className="text-sm text-gray-500">
                {props.itemCount ?? 0} species
              </Text>
            )}
          </View>

          {showMore && (
            <TouchableOpacity onPress={onMore} hitSlop={10}>
              <Ionicons name="ellipsis-vertical" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
