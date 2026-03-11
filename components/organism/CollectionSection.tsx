import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import EmptyState from "@/components/molecule/EmptyState";
import SortModal from "@/components/molecule/SortModal";
import ActionButton from "@/components/atom/button/ActionButton";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import FolderModal, {
  FolderActionModal,
  modalShadow,
} from "@/components/organism/modal/FolderModal";
import CardItem from "@/components/molecule/CardItem";
import { SortOption, getSortLabel } from "@/utils/sort";
import { useFolders } from "@/hooks/useFolders";
import { useCollection } from "@/hooks/useCollection";
import { Folder } from "@/services/folders";
import { CollectionItem } from "@/services/collection";

export default function CollectionSection() {
  const { t } = useTranslation();
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders();
  const { collection, removeFromCollection, addItemToFolders } =
    useCollection();
  const [showCreate, setShowCreate] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showFolderActionModal, setShowFolderActionModal] = useState(false);
  const [selectedUnfiledItem, setSelectedUnfiledItem] =
    useState<CollectionItem | null>(null);
  const [showUnfiledActionModal, setShowUnfiledActionModal] = useState(false);
  const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const hasFolders = folders.length > 0;

  const unfiledItems = useMemo(
    () =>
      collection.filter(
        (item) => !item.folder_ids || item.folder_ids.length === 0,
      ),
    [collection],
  );

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return b.id.localeCompare(a.id);
        case "oldest":
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });
  }, [folders, sortOption]);

  const handleUnfiledMore = (item: CollectionItem) => {
    setSelectedUnfiledItem(item);
    setShowUnfiledActionModal(true);
  };

  const handleRemoveFromCollection = () => {
    if (!selectedUnfiledItem) return;
    setShowUnfiledActionModal(false);
    Alert.alert(
      t("collection.item.removeTitle"),
      t("collection.item.removeMessage", {
        name: selectedUnfiledItem.species_name,
      }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("collection.item.removeButton"),
          style: "destructive",
          onPress: () => {
            const run = async () => {
              try {
                await removeFromCollection(selectedUnfiledItem.species_id);
              } catch (err: any) {
                Alert.alert(
                  t("common.error"),
                  err.message || t("collection.item.removeError"),
                );
              }
            };
            run();
          },
        },
      ],
    );
  };

  const handleOpenAddToFolder = () => {
    setShowUnfiledActionModal(false);
    setSelectedFolderIds([]);
    setShowAddToFolderModal(true);
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

  const handleConfirmAddToFolders = () => {
    if (!selectedUnfiledItem || selectedFolderIds.length === 0) return;
    const run = async () => {
      try {
        await addItemToFolders(
          selectedUnfiledItem.species_id,
          selectedFolderIds,
        );
        setShowAddToFolderModal(false);
      } catch (err: any) {
        Alert.alert(
          t("common.error"),
          err.message || t("collection.item.addToFolderError"),
        );
      }
    };
    run();
  };

  const handleDeleteFolder = () => {
    if (!selectedFolder) return;
    setShowFolderActionModal(false);
    Alert.alert(
      t("collection.folder.deleteTitle"),
      t("collection.folder.deleteMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.deleteButton"),
          style: "destructive",
          onPress: () => {
            deleteFolder(selectedFolder.id);
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1">
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

      {/* Create / Edit Folder Modal */}
      <FolderModal
        visible={showCreate || !!editingFolder}
        title={
          editingFolder
            ? t("collection.folder.editTitle")
            : t("collection.folder.createTitle")
        }
        submitLabel={
          editingFolder ? t("collection.folder.editSubmit") : t("common.create")
        }
        initialName={editingFolder?.name}
        initialColor={editingFolder?.color}
        onClose={() => {
          setShowCreate(false);
          setEditingFolder(null);
        }}
        onSubmit={(name, color) => {
          if (editingFolder) {
            updateFolder(editingFolder.id, { name, color });
          } else {
            createFolder(name, color);
          }
        }}
      />

      {/* Folder Action Modal */}
      {selectedFolder && (
        <FolderActionModal
          folder={selectedFolder}
          visible={showFolderActionModal}
          onClose={() => setShowFolderActionModal(false)}
          onEdit={() => {
            setShowFolderActionModal(false);
            setEditingFolder(selectedFolder);
          }}
          onDelete={handleDeleteFolder}
        />
      )}

      {/* Unfiled Item Action Modal */}
      <Modal
        visible={showUnfiledActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnfiledActionModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
            <Text className="text-lg font-bold mb-0.5">
              {selectedUnfiledItem?.species_name}
            </Text>
            <Text className="text-sm text-gray-500 italic mb-5">
              {selectedUnfiledItem?.species_scientific_name}
            </Text>

            {hasFolders && (
              <TouchableOpacity
                className="flex-row items-center py-3 border-b border-gray-100"
                onPress={handleOpenAddToFolder}
              >
                <View className="w-9 h-9 rounded-full bg-green-50 items-center justify-center mr-3">
                  <Ionicons name="folder-outline" size={18} color="#22A45D" />
                </View>
                <Text className="text-base text-gray-800">
                  {t("collection.item.addToFolder")}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={handleRemoveFromCollection}
            >
              <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </View>
              <Text className="text-base text-red-500">
                {t("collection.item.removeFromCollection")}
              </Text>
            </TouchableOpacity>

            <View className="mt-3">
              <PrimaryButton
                title={t("common.cancel")}
                onPress={() => setShowUnfiledActionModal(false)}
                size="small"
                variant="outlined"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add to Folder Selection Modal */}
      <Modal
        visible={showAddToFolderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddToFolderModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
            <Text className="text-lg font-bold mb-1">
              {t("collection.item.addToFolderTitle")}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              {t("collection.item.addToFolderSubtitle", {
                name: selectedUnfiledItem?.species_name,
              })}
            </Text>

            <ScrollView
              className="max-h-64 mb-4"
              showsVerticalScrollIndicator={false}
            >
              {folders.map((folder) => {
                const isSelected = selectedFolderIds.includes(folder.id);
                return (
                  <TouchableOpacity
                    key={folder.id}
                    className={`flex-row items-center p-3 rounded-xl mb-2 ${isSelected ? "bg-green-50" : "bg-gray-50"}`}
                    onPress={() => toggleFolderSelection(folder.id)}
                  >
                    <View
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: folder.color }}
                    />
                    <Text className="flex-1 text-base text-gray-800">
                      {folder.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#22A45D"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View className="flex-row gap-2">
              <View className="flex-1">
                <PrimaryButton
                  title={t("common.cancel")}
                  onPress={() => setShowAddToFolderModal(false)}
                  size="small"
                  variant="outlined"
                  fullWidth
                  style={{ shadowColor: "transparent" }}
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  title={t("common.confirm")}
                  onPress={handleConfirmAddToFolders}
                  size="small"
                  fullWidth
                  style={{
                    shadowColor: "transparent",
                    opacity: selectedFolderIds.length === 0 ? 0.4 : 1,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toolbar */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <ActionButton
          type="sort"
          label={getSortLabel(sortOption, t)}
          isOpen={showSort}
          onPress={() => setShowSort(true)}
        />
        <PrimaryButton
          title={t("common.create")}
          onPress={() => setShowCreate(true)}
          icon="plus"
          size="small"
          variant="outlined"
          style={{ shadowColor: "transparent", borderRadius: 12 }}
          textStyle={{ fontWeight: "600" }}
          iconType="ant"
          fullWidth={false}
        />
      </View>

      {/* Content */}
      <View className="flex-1 px-5 pt-2">
        {hasFolders || unfiledItems.length > 0 ? (
          <>
            {hasFolders && (
              <View className="flex-row flex-wrap">
                {sortedFolders.map((folder, i) => (
                  <View
                    key={folder.id}
                    style={{
                      width: "48%",
                      marginRight: i % 2 === 0 ? "4%" : 0,
                      marginBottom: 16,
                    }}
                  >
                    <CardItem
                      variant="folder"
                      name={folder.name}
                      accentColor={folder.color}
                      itemCount={folder.item_count}
                      onPress={() =>
                        router.push({
                          pathname: "/collection/[id]",
                          params: { id: folder.id },
                        })
                      }
                      onMore={() => {
                        setSelectedFolder(folder);
                        setShowFolderActionModal(true);
                      }}
                    />
                  </View>
                ))}
              </View>
            )}

            {unfiledItems.length > 0 && (
              <View className="mt-2">
                <Text className="text-lg font-semibold text-gray-700 mb-3">
                  {t("collection.unfiledTitle", { count: unfiledItems.length })}
                </Text>
                <View className="flex-row flex-wrap">
                  {unfiledItems.map((item, i) => (
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
                        accentColor="#6B7280"
                        scientificName={item.species_scientific_name}
                        imageUri={item.user_image_url || item.species_image}
                        onPress={() =>
                          router.push({
                            pathname: "/detail/[id]",
                            params: { id: item.species_id },
                          })
                        }
                        onMore={() => handleUnfiledMore(item)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center pt-8">
            <EmptyState
              icon="folder-outline"
              title={t("collection.empty.title")}
              description={t("collection.empty.description")}
              buttonTitle={t("collection.empty.button")}
              onButtonPress={() => router.push("/(tabs)/explore")}
            />
          </View>
        )}
      </View>
    </View>
  );
}
