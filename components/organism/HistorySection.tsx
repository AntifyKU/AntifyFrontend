import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import EmptyState from "@/components/molecule/EmptyState";
import { openIdentifySheet } from "@/utils/identifyHelper";
import { useAuth } from "@/context/AuthContext";
import { History } from "@/constants/MockHistory";
import ProfileItemCard from "@/components/molecule/ProfileItemListCard";
import SortModal from "@/components/molecule/SortModal";
import ActionButton from "@/components/atom/button/ActionButton";
import { SortOption, getSortLabel } from "@/utils/sort";

export default function HistorySection() {
  const { user } = useAuth();
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const hasHistory = History.length > 0;

  const sortedHistory = useMemo(() => {
    return [...History].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      switch (sortOption) {
        case "newest":
          return timeB - timeA;
        case "oldest":
          return timeA - timeB;
        case "name-asc":
          return (a.species_name || "").localeCompare(b.species_name || "");
        case "name-desc":
          return (b.species_name || "").localeCompare(a.species_name || "");
        default:
          return 0;
      }
    });
  }, [sortOption]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleItemPress = (id: string) => {
    router.push({ pathname: "/detail/[id]", params: { id } });
  };

  return (
    <View className="flex-1">
      {!user && (
        <View className="items-center mt-6 mb-4">
          <Text className="text-xl font-semibold text-gray-800 text-center">
            History
          </Text>
          <View className="w-20 h-1 bg-[#22A45D] rounded-full mt-2" />
        </View>
      )}

      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      {hasHistory && (
        <View className="flex-row items-center justify-between px-5 mb-4">
          <View />
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
        </View>
      )}

      <View className="flex-1 px-4 pt-2">
        {hasHistory ? (
          <View>
            {sortedHistory.map((item) => (
              <ProfileItemCard
                key={item.id}
                id={item.species_id}
                title={item.species_name}
                description={formatDate(item.created_at)}
                image={item.image_url}
                onPress={() => handleItemPress(item.species_id)}
                variant="menu"
                onDeleteHistory={() => console.log("delete", item.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No history yet"
            description="Start identifying ants to see your history here"
            image={require("@/assets/images/ant.png")}
            buttonTitle="Start Identifying"
            onButtonPress={openIdentifySheet}
          />
        )}
      </View>
    </View>
  );
}
