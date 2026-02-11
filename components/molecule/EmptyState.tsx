import React from "react";
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/atom/button/PrimaryButton";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  image?: ImageSourcePropType;
  imageSize?: number;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonTitle?: string;
  onButtonPress?: () => void;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({
  title = "Nothing here",
  description = "",
  icon = "alert-circle-outline",
  iconSize = 64,
  iconColor = "#D1D5DB",
  image,
  imageSize = 64,
  containerStyle,
  titleStyle,
  descriptionStyle,
  buttonTitle,
  onButtonPress,
  buttonIcon,
}: EmptyStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={containerStyle}
    >
      {image ? (
        <Image
          source={image}
          style={{ width: imageSize, height: imageSize, marginBottom: 12 }}
          resizeMode="contain"
        />
      ) : (
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      )}

      {title && (
        <Text className="mt-4 text-gray-500 text-center" style={titleStyle}>
          {title}
        </Text>
      )}

      {description && (
        <Text
          className="mt-1 text-gray-400 text-center"
          style={descriptionStyle}
        >
          {description}
        </Text>
      )}

      {buttonTitle && onButtonPress && (
        <View className="mt-6">
          <PrimaryButton
            title={buttonTitle}
            onPress={onButtonPress}
            fullWidth={false}
            icon={buttonIcon}
            style={{ shadowColor: "transparent", elevation: 0}}
          />
        </View>
      )}
    </View>
  );
}
