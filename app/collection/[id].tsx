import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import CardItem from "@/components/molecule/CardItem";
import SortModal from "@/components/molecule/SortModal";
import ActionButton from "@/components/atom/button/ActionButton";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import EmptyState from "@/components/molecule/EmptyState";
import { SortOption, getSortLabel } from "@/utils/sort";
import { useFolders } from "@/hooks/useFolders";
import { useCollection } from "@/hooks/useCollection";
import { CollectionItem } from "@/services/collection";
import { useTranslation } from "react-i18next";

const modalShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
};

export default function CollectionDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { folders } = useFolders();
  const { collection, removeItemFromFolder } = useCollection();

  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [showItemActionModal, setShowItemActionModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const currentFolder = useMemo(
    () => folders.find((f) => f.id === id),
    [folders, id],
  );

  const folderItems = useMemo(
    () => collection.filter((item) => item.folder_ids?.includes(id)),
    [collection, id],
  );

  const sortedItems = useMemo(() => {
    return [...folderItems].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.species_name.localeCompare(b.species_name);

        case "name-desc":
          return b.species_name.localeCompare(a.species_name);

        case "newest":
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );

        case "oldest":
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          );

        default:
          return 0;
      }
    });
  }, [folderItems, sortOption]);

  const handleItemMore = (item: CollectionItem) => {
    setSelectedItem(item);
    setShowItemActionModal(true);
  };

  const handleRemoveFromFolder = () => {
    if (!selectedItem || !id) return;

    setShowItemActionModal(false);

    Alert.alert(
      t("collection.folder.removeTitle"),
      t("collection.folder.removeConfirm", {
        name: selectedItem.species_name,
      }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("collection.folder.removeButton"),
          style: "destructive",
          onPress: () => {
            (async () => {
              setIsRemoving(true);

              try {
                await removeItemFromFolder(selectedItem.species_id, id);
              } catch (err: any) {
                Alert.alert(
                  t("common.error"),
                  err.message || t("collection.folder.removeError"),
                );
              } finally {
                setIsRemoving(false);
              }
            })();
          },
        },
      ],
    );
  };

  if (!currentFolder) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">
            {t("collection.folder.folderNotFound")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Sort Modal */}
      <SortModal
        visible={showSort}
        selected={sortOption}
        onClose={() => setShowSort(false)}
        onSelect={(opt) => {
          setSortOption(opt);
          setShowSort(false);
        }}
      />

      {/* Item Action Modal */}
      <Modal
        visible={showItemActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowItemActionModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
            <Text className="text-lg font-bold mb-0.5">
              {selectedItem?.species_name}
            </Text>

            <Text className="text-sm text-gray-500 italic mb-5">
              {selectedItem?.species_scientific_name}
            </Text>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleRemoveFromFolder}
              disabled={isRemoving}
            >
              <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                <Ionicons
                  name="folder-open-outline"
                  size={18}
                  color="#EF4444"
                />
              </View>

              <Text className="text-base text-red-500">
                {isRemoving
                  ? t("collection.folder.removing")
                  : t("collection.folder.removeFromFolder")}
              </Text>
            </TouchableOpacity>

            <View className="mt-3">
              <PrimaryButton
                title={t("common.cancel")}
                onPress={() => setShowItemActionModal(false)}
                size="small"
                variant="outlined"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View className="pt-4 pb-5">
        <ScreenHeader
          title={currentFolder.name}
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
      </View>

      {/* Toolbar */}
      {folderItems.length > 0 && (
        <View className="flex-row items-center justify-end px-5">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption, t)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />
        </View>
      )}

      {/* Folder Info */}
      <View className="px-5 pb-4 flex-row items-center">
        <View
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: currentFolder.color }}
        />

        <Text className="text-gray-600">
          {t("collection.folder.speciesCount", {
            count: folderItems.length,
          })}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5">
        {sortedItems.length > 0 ? (
          <View className="flex-row flex-wrap pb-6">
            {sortedItems.map((item, i) => (
              <View
                key={item.id}
                style={{
                  width: "48%",
                  marginRight: i % 2 === 0 ? "4%" : 0,
                  marginBottom: 16,
                }}
              >
                <CardItem
                  variant="species"
                  name={item.species_name}
                  accentColor={currentFolder.color}
                  scientificName={item.species_scientific_name}
                  imageUri={item.user_image_url || item.species_image}
                  onPress={() =>
                    router.push({
                      pathname: "/detail/[id]",
                      params: { id: item.species_id },
                    })
                  }
                  onMore={() => handleItemMore(item)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-16">
            <EmptyState
              icon="folder-open-outline"
              title={t("collection.folder.emptyTitle")}
              description={t("collection.folder.emptyDescription")}
              buttonTitle={t("collection.folder.goToCollection")}
              onButtonPress={() => router.back()}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
