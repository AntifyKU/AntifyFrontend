import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/molecule/TabBar";
import { useTranslation } from "react-i18next";

function CustomTabBar(props: any) {
  return <TabBar {...props} />;
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={CustomTabBar}>
      <Tabs.Screen name="index" options={{ href: null }} redirect />
      <Tabs.Screen name="index-home" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="explore" options={{ title: t("tabs.explore") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    </Tabs>
  );
}
