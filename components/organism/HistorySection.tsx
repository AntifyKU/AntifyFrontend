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
import ActionButton from "@/components/atom/button/ActionButton";
import EmptyState from "@/components/molecule/EmptyState";
import { useHistory } from "@/hooks/useHistory";
import { useAuth } from "@/context/AuthContext";
import { SortOption, getSortLabel } from "@/utils/sort";
import { openIdentifySheet } from "@/utils/identifyHelper";
import type { HistoryRecord } from "@/types/api";

const MODAL_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
} as const;

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

function useFormatDate() {
  const { t } = useTranslation();
  return (dateString: string): string => {
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
}

function sortRecords(
  records: HistoryRecord[],
  option: SortOption,
): HistoryRecord[] {
  return [...records].sort((a, b) => {
    switch (option) {
      case "newest":
        return (
          new Date(b.identifiedAt).getTime() -
          new Date(a.identifiedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.identifiedAt).getTime() -
          new Date(b.identifiedAt).getTime()
        );
      case "name-asc":
        return a.speciesName.localeCompare(b.speciesName);
      case "name-desc":
        return b.speciesName.localeCompare(a.speciesName);
      default:
        return 0;
    }
  });
}

const HistorySection: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatDate = useFormatDate();

  const { records, loading, removeRecord, clearHistory } = useHistory();

  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedItem, setSelectedItem] = useState<HistoryRecord | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const sortedRecords = useMemo(
    () => sortRecords(records, sortOption),
    [records, sortOption],
  );

  const handleItemMore = (item: HistoryRecord) => {
    setSelectedItem(item);
    setShowActionModal(true);
  };

  const handleCardPress = (item: HistoryRecord) => {
    const speciesId =
      item.topPredictions?.find((p) => p.rank === 1)?.speciesId ??
      item.speciesInfo?.id ??
      null;

    if (!speciesId) {
      Alert.alert(t("common.error"), t("history.noSpeciesId"));
      return;
    }

    router.push({ pathname: "/detail/[id]", params: { id: speciesId } });
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
          removeRecord(selectedItem.id).catch(() => {
            Alert.alert(t("common.error"), t("history.deleteError"));
          });
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(t("history.clearAllTitle"), t("history.clearAllMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.clearAll"),
        style: "destructive",
        onPress: () => {
          clearHistory().catch(() => {
            Alert.alert(t("common.error"), t("history.clearAllError"));
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      {/* Guest header */}
      {!user && (
        <View className="items-center mb-6">
          <Text className="text-xl font-semibold text-gray-800 text-center">
            {t("history.title")}
          </Text>
          <View className="w-20 h-1 bg-[#22A45D] rounded-full mt-2" />
        </View>
      )}

      {/* Sort modal */}
      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      {/* Action modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View
            className="bg-white w-full rounded-2xl p-5"
            style={MODAL_SHADOW}
          >
            <Text className="text-lg font-bold mb-0.5">
              {selectedItem?.speciesName}
            </Text>
            <ConfidenceText confidence={selectedItem?.confidence ?? 0} />

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100"
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
      {!loading && records.length > 0 && (
        <View className="flex-row items-center justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption, t)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
          <PrimaryButton
            title={t("common.clearAll")}
            icon="trash-outline"
            size="small"
            variant="filled"
            fullWidth={false}
            onPress={handleClearAll}
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              shadowColor: "transparent",
              minHeight: 40,
            }}
            textStyle={{
              color: "#EF4444",
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 4,
            }}
            iconColor="#EF4444"
          />
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#0A9D5C" />
          <Text className="mt-2 text-gray-500">{t("history.loading")}</Text>
        </View>
      )}

      {/* Content */}
      {!loading && (
        <View className="px-5">
          {sortedRecords.length > 0 ? (
            <>
              <Text className="text-gray-500 text-sm mb-3 text-center">
                {t("history.subtitle")}
              </Text>
              {sortedRecords.map((item) => (
                <View key={item.id} className="relative">
                  <ListCard
                    id={item.id}
                    title={item.speciesName}
                    description={`${t("helpImprove.matchPercentage", {
                      value: (item.confidence * 100).toFixed(1),
                    })} • ${formatDate(item.identifiedAt)}`}
                    image={item.imageBase64}
                    onPress={() => handleCardPress(item)}
                    onMore={() => handleItemMore(item)}
                    showChevron={false}
                  />
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
