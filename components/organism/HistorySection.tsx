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
import { useTranslation } from "react-i18next";
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

interface ConfidenceTextProps {
  readonly confidence: number;
}

function ConfidenceText({ confidence }: ConfidenceTextProps) {
  const { t } = useTranslation();
  return (
    <Text className="text-sm text-gray-500 mb-5">
      {t("history.confidence", { value: Math.round(confidence * 100) })}
    </Text>
  );
}

const HistorySection: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { history, isLoading, deleteItem, clearAll } = useHistory();
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
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

  const handleDelete = () => {
    if (!selectedItem) return;
    setShowActionModal(false);
    Alert.alert(t("history.deleteTitle"), t("history.deleteMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          const run = async () => {
            try {
              await deleteItem(selectedItem.id);
            } catch {
              Alert.alert(t("common.error"), t("history.deleteError"));
            }
          };
          run();
        },
      },
    ]);
  };

  const handleViewDetails = () => {
    if (!selectedItem) return;
    setShowActionModal(false);
    router.push({ pathname: "/detail/[id]", params: { id: selectedItem.id } });
  };

  const handleClearAll = () => {
    Alert.alert(t("history.clearAllTitle"), t("history.clearAllMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.clearAll"),
        style: "destructive",
        onPress: () => {
          const run = async () => {
            try {
              await clearAll();
            } catch {
              Alert.alert(t("common.error"), t("history.clearAllError"));
            }
          };
          run();
        },
      },
    ]);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("history.timeJustNow");
    if (diffMins < 60) return t("history.timeMinutes", { count: diffMins });
    if (diffHours < 24) return t("history.timeHours", { count: diffHours });
    if (diffDays < 7) return t("history.timeDays", { count: diffDays });
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1">
      {!user && (
        <View className="items-center mt-6 mb-4">
          <Text className="text-xl font-semibold text-gray-800 text-center">
            {t("history.title")}
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
            <ConfidenceText confidence={selectedItem?.top_confidence ?? 0} />

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={handleViewDetails}
            >
              <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="eye-outline" size={18} color="#3B82F6" />
              </View>
              <Text className="text-base text-gray-800">
                {t("history.viewDetails")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleDelete}
            >
              <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </View>
              <Text className="text-base text-red-500">
                {t("history.deleteFromHistory")}
              </Text>
            </TouchableOpacity>

            <View className="mt-3">
              <PrimaryButton
                title={t("common.cancel")}
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

      {/* Sort + Clear All row */}
      {!isLoading && history.length > 0 && (
        <View className="flex-row items-center justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption, t)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
          <TouchableOpacity
            onPress={handleClearAll}
            className="flex-row items-center px-4 py-2 bg-red-50 rounded-xl"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text className="ml-2 text-sm font-semibold text-red-500">
              {t("common.clearAll")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#0A9D5C" />
          <Text className="mt-2 text-gray-500">{t("history.loading")}</Text>
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <View className="px-5">
          {sortedHistory.length > 0 ? (
            <>
              <Text className="text-gray-500 text-sm mb-3 text-center">
                {t("history.subtitle")}
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
                title={t("history.empty.title")}
                description={t("history.empty.description")}
                image={require("@/assets/images/ant.png")}
                buttonTitle={t("history.empty.button")}
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
