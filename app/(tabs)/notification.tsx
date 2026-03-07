import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StatusBar, Dimensions } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import RequestBadge from "@/components/atom/badge/RequestBadge";
import { MenuItem } from "@/components/atom/MenuItem";
import RequestCard from "@/components/molecule/RequestCard";
import { TabSwitcher } from "@/components/atom/TabSwitcher";
import { useAuth } from "@/context/AuthContext";

type Role = "user" | "admin";
type Status = "pending" | "approved" | "rejected";
type TabType = "request" | "system";

interface RequestItem {
  id: string;
  title: string;
  action: string;
  status: Status;
  date: string;
  by?: string;
}

interface SystemItem {
  id: string;
  title: string;
  description: string;
}

/* mock */
const REQUESTS: RequestItem[] = [
  {
    id: "1",
    title: "Yellow Crazy Ant",
    action: "Update Info",
    status: "pending",
    date: "Jan 15, 2024",
    by: "John Doe",
  },
  {
    id: "2",
    title: "Asian Weaver Ant",
    action: "Add Species",
    status: "approved",
    date: "Jan 20, 2024",
    by: "Jane",
  },
];

const SYSTEM: SystemItem[] = [
  //   { id: "1", title: "Update", description: "New version available" },
  //   { id: "2", title: "Notice", description: "System maintenance tonight" },
];

const ROLE: Role = "admin";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function NotificationScreen() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [activeTab, setActiveTab] = useState<TabType>(
    isAuthenticated ? "request" : "system",
  );

  const filtered = useMemo(
    () =>
      filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === filter),
    [filter],
  );

  const countAll = REQUESTS.length;
  const countPending = REQUESTS.filter((r) => r.status === "pending").length;
  const countApproved = REQUESTS.filter((r) => r.status === "approved").length;
  const countRejected = REQUESTS.filter((r) => r.status === "rejected").length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader title="Notification" leftIcon="chevron-back" />
      </View>

      {/* Tab Switcher */}
      {isAuthenticated && (
        <View className="px-5 mt-4 mb-4">
          <TabSwitcher
            tabs={[
              {
                value: "request" as TabType,
                label: "Requests",
                count: countAll,
              },
              {
                value: "system" as TabType,
                label: "System",
                count: SYSTEM.length,
              },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isAuthenticated && activeTab === "request" && (
          <>
            <View className="px-5 mb-3">
              <Text className="text-lg font-semibold text-gray-800">
                {ROLE === "admin" ? "Requests" : "Your Requests"}
              </Text>
            </View>

            {/* Filter badges */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-5"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingRight: 32,
              }}
            >
              <RequestBadge
                label="ALL"
                isSelected={filter === "all"}
                onPress={() => setFilter("all")}
                count={countAll}
              />
              <RequestBadge
                label="PENDING"
                isSelected={filter === "pending"}
                onPress={() => setFilter("pending")}
                count={countPending}
              />
              <RequestBadge
                label="APPROVED"
                isSelected={filter === "approved"}
                onPress={() => setFilter("approved")}
                count={countApproved}
              />
              <RequestBadge
                label="REJECTED"
                isSelected={filter === "rejected"}
                onPress={() => setFilter("rejected")}
                count={countRejected}
              />
            </ScrollView>

            {/* Count */}
            <View className="px-5 mb-4">
              <Text className="text-base text-gray-500">
                {filtered.length} requests found
              </Text>
            </View>

            {/* Request cards */}
            <View className="px-5">
              {filtered.map((item) => (
                <RequestCard
                  key={item.id}
                  title={item.title}
                  action={item.action}
                  status={item.status}
                  date={item.date}
                  by={item.by}
                  role={ROLE}
                  onPress={() => console.log("open detail", item.id)}
                />
              ))}
            </View>

            {filtered.length === 0 && (
              <View
                style={{ minHeight: SCREEN_HEIGHT * 0.4 }}
                className="items-center justify-center px-5"
              >
                <AntDesign name="form" size={48} color="#9CA3AF" />
                <Text className="mt-4 text-lg font-semibold text-gray-500">
                  No requests found
                </Text>
                <Text className="mt-1 text-sm text-gray-400 text-center">
                  There are no {filter === "all" ? "" : filter} requests at the
                  moment
                </Text>
              </View>
            )}
          </>
        )}

        {(!isAuthenticated || activeTab === "system") && (
          <>
            <View className="px-5 mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                System
              </Text>
            </View>

            <View className="px-5">
              {SYSTEM.length > 0 ? (
                SYSTEM.map((item) => (
                  <MenuItem
                    key={item.id}
                    icon="notifications-outline"
                    title={item.title}
                    description={item.description}
                    onPress={() => console.log("Menu clicked")}
                    showChevron={false}
                    leftSlot={
                      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                        <Ionicons
                          name="settings-outline"
                          size={18}
                          color="#64748B"
                        />
                      </View>
                    }
                  />
                ))
              ) : (
                <View
                  style={{ minHeight: SCREEN_HEIGHT * 0.5 }}
                  className="items-center justify-center"
                >
                  <Ionicons
                    name="notifications-off-outline"
                    size={48}
                    color="#9CA3AF"
                  />
                  <Text className="mt-4 text-lg font-semibold text-gray-500">
                    No system notifications
                  </Text>
                  <Text className="mt-1 text-sm text-gray-400 text-center">
                    You're all caught up!
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
