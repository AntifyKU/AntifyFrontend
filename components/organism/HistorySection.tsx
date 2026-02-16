import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "@/components/ListCard";
import SortModal from "@/components/molecule/SortModal";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { SortOption, getSortLabel } from "@/utils/sort";
import ActionButton from "@/components/atom/button/ActionButton";
import EmptyState from "@/components/molecule/EmptyState";
import { useHistory } from "@/hooks/useHistory";
import { HistoryItem } from "@/types/api";
import { openIdentifySheet } from "@/utils/identifyHelper";
import { useAuth } from "@/context/AuthContext";

const modalShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
};

const HistorySection: React.FC = () => {
  const { user } = useAuth();
  const { history, isLoading, deleteItem, clearAll } = useHistory();
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.identified_at).getTime() -
            new Date(a.identified_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.identified_at).getTime() -
            new Date(b.identified_at).getTime()
          );
        case "name-asc":
          return a.top_prediction.localeCompare(b.top_prediction);
        case "name-desc":
          return b.top_prediction.localeCompare(a.top_prediction);
        default:
          return 0;
      }
    });
  }, [history, sortOption]);

  const handleItemMore = (item: HistoryItem) => {
    setSelectedItem(item);
    setShowActionModal(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setShowActionModal(false);

    Alert.alert(
      "Delete History",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingItemId(selectedItem.id);
            try {
              await deleteItem(selectedItem.id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
            } finally {
              setDeletingItemId(null);
            }
          },
        },
      ],
    );
  };

  const handleViewDetails = () => {
    if (!selectedItem) return;

    setShowActionModal(false);

    // Navigate to history detail
    router.push({
      pathname: "/detail/[id]",
      params: { id: selectedItem.id },
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete all history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAll();
            } catch (error) {
              Alert.alert("Error", "Failed to clear history");
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
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

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
            <Text className="text-lg font-bold mb-0.5">
              {selectedItem?.top_prediction}
            </Text>
            <Text className="text-sm text-gray-500 mb-5">
              {Math.round((selectedItem?.top_confidence || 0) * 100)}%
              confidence
            </Text>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={handleViewDetails}
            >
              <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="eye-outline" size={18} color="#3B82F6" />
              </View>
              <Text className="text-base text-gray-800">View details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleDelete}
            >
              <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </View>
              <Text className="text-base text-red-500">
                Delete from history
              </Text>
            </TouchableOpacity>

            <View className="mt-3">
              <PrimaryButton
                title="Cancel"
                onPress={() => setShowActionModal(false)}
                size="small"
                variant="outlined"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort row */}
      {!isLoading && history.length > 0 && (
        <View className="flex-row items-center justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
          <TouchableOpacity
            onPress={handleClearAll}
            className="flex-row items-center px-4 py-2 bg-red-50 rounded-xl"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text className="ml-2 text-sm font-semibold text-red-500">
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#0A9D5C" />
          <Text className="mt-2 text-gray-500">Loading...</Text>
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <View className="px-5">
          {sortedHistory.length > 0 ? (
            <>
              <Text className="text-gray-500 text-sm mb-3 text-center">
                Your identification history
              </Text>

              {sortedHistory.map((item) => (
                <View key={item.id} className="relative">
                  <ListCard
                    id={item.id}
                    title={item.top_prediction}
                    description={`${Math.round(item.top_confidence * 100)}% confidence • ${formatDate(item.identified_at)}`}
                    image={item.image_uri}
                    onPress={handleViewDetails}
                    showChevron={false}
                  />

                  {/* Ellipsis Menu Button */}
                  <TouchableOpacity
                    onPress={() => handleItemMore(item)}
                    className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={18}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View className="pt-8">
              <EmptyState
                icon="time-outline"
                title="No history yet"
                description="Your identification history will appear here"
                image={require("@/assets/images/ant.png")}
                buttonTitle="Identify Now"
                onButtonPress={openIdentifySheet}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default HistorySection;
