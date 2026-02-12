import React, { useState } from "react";
import { View, Text, Modal, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import RequestBadge from "@/components/atom/badge/RequestBadge";
import { MenuItem } from "@/components/atom/MenuItem";
import RequestCard from "@/components/molecule/RequestCard";

type Role = "user" | "admin";
type Status = "pending" | "approved" | "rejected";

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

interface Props {
  visible: boolean;
  role: Role;
  onClose: () => void;
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
  { id: "1", title: "Update", description: "New version available" },
  { id: "2", title: "Notice", description: "System maintenance tonight" },
];

export default function NotificationModal({ visible, role, onClose }: Props) {
  const [filter, setFilter] = useState<"all" | Status>("all");

  const filtered =
    filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === filter);

  const countAll = REQUESTS.length;
  const countPending = REQUESTS.filter((r) => r.status === "pending").length;
  const countApproved = REQUESTS.filter((r) => r.status === "approved").length;
  const countRejected = REQUESTS.filter((r) => r.status === "rejected").length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
        {/* Header */}
        <View className="py-6">
          <ScreenHeader
            title="Notification"
            leftIcon="chevron-back"
            onLeftPress={onClose}
          />
        </View>

        <ScrollView className="flex-1 px-6">
          <Text className="mt-4 mb-3 text-lg font-semibold text-gray-800">
            {role === "admin" ? "Requests" : "Your Requests"}
          </Text>

          {/* filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-5"
            contentContainerStyle={{ paddingRight: 12 }}
          >
            <View className="flex-row">
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
            </View>
          </ScrollView>

          {filtered.map((item) => (
            <RequestCard
              key={item.id}
              title={item.title}
              action={item.action}
              status={item.status}
              date={item.date}
              by={item.by}
              role={role}
              onPress={() => console.log("open detail", item.id)}
            />
          ))}

          <Text className="mt-8 mb-2 text-lg font-semibold text-gray-800">
            System
          </Text>

          {SYSTEM.map((item) => (
            <MenuItem
              key={item.id}
              icon="notifications-outline"
              title={item.title}
              description={item.description}
              onPress={() => console.log("Menu clicked")}
              showChevron={false}
              leftSlot={
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Ionicons name="settings-outline" size={18} color="#64748B" />
                </View>
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
