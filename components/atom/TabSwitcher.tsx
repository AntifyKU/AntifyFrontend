import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export interface Tab<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabSwitcherProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function TabSwitcher<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  activeColor = "#22A45D",
  inactiveColor = "#6B7280",
}: TabSwitcherProps<T>) {
  return (
    <View className="flex-row p-1 bg-gray-100 rounded-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const displayLabel =
          tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label;

        return (
          <Pressable
            key={tab.value}
            className="flex-1 py-3 rounded-full"
            style={[isActive && { backgroundColor: activeColor }]}
            onPress={() => onTabChange(tab.value)}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          >
            {({ pressed }) => (
              <Text
                className="text-center font-medium"
                style={[
                  isActive ? { color: "#FFFFFF" } : { color: inactiveColor },
                  pressed && styles.pressed,
                ]}
              >
                {displayLabel}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
