import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

const CollectionPage = ({ id }: { id: string }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader
          title="Collection Name"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
};

export default CollectionPage;
