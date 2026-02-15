"use client";

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function CollectionRedirect() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      router.replace(`/collection/${id}`);
    } else {
      router.replace("/");
    }
  }, [id]);

  return (
    <View className="flex-1 items-center justify-center bg-[#f5f7e8]">
      <ActivityIndicator size="large" color="#328e6e" />
    </View>
  );
}
