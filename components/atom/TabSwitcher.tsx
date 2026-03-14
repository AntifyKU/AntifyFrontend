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
}: Readonly<TabSwitcherProps<T>>) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const label =
          tab.count === undefined ? tab.label : `${tab.label} (${tab.count})`;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            style={[
              styles.tab,
              { width: `${100 / tabs.length}%` },
              isActive && { backgroundColor: activeColor },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isActive ? "#fff" : inactiveColor },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 100,
    padding: 6,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
  },
});
