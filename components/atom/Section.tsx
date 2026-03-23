import { View, Text } from "react-native";

export const Section = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <View className="mb-4">
    <Text className="text-base font-semibold text-gray-800 mb-2">{title}</Text>
    <Text className="text-base text-gray-600 leading-6">{content}</Text>
  </View>
);
