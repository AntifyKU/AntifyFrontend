import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import EmptyState from "@/components/molecule/EmptyState";
import SortModal from "@/components/molecule/SortModal";
import ActionButton from "@/components/atom/button/ActionButton";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import FolderModal from "@/components/organism/modal/FolderModal";

import { SortOption, getSortLabel } from "@/utils/sort";
import { useFolders } from "@/hooks/useFolders";
import { Folder } from "@/services/folders";

export default function CollectionSection() {
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders();

  const [showCreate, setShowCreate] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const hasFolders = folders.length > 0;

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
        title={editingFolder ? "Edit Folder" : "Create Folder"}
        submitLabel={editingFolder ? "Update" : "Create"}
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

      {/* Action Modal */}
      {selectedFolder && (
        <ActionModal
          folder={selectedFolder}
          visible={showActionModal}
          onClose={() => setShowActionModal(false)}
          onEdit={() => {
            setShowActionModal(false);
            setEditingFolder(selectedFolder);
          }}
          onDelete={() => {
            setShowActionModal(false);
            Alert.alert(
              "Delete collection",
              "Are you sure to delete this collection? This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteFolder(selectedFolder.id),
                },
              ],
            );
          }}
        />
      )}

      {hasFolders && (
        <View className="flex-row items-center justify-between px-5 mb-4">
          <ActionButton
            type="sort"
            label={getSortLabel(sortOption)}
            isOpen={showSort}
            onPress={() => setShowSort(true)}
          />

          <PrimaryButton
            title="Create"
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
      )}

      <View className="flex-1 px-5 pt-2">
        {hasFolders ? (
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
                <FolderCard
                  folder={folder}
                  onPress={() =>
                    router.push({
                      pathname: "/collection/[id]",
                      params: { id: folder.id },
                    })
                  }
                  onMore={() => {
                    setSelectedFolder(folder);
                    setShowActionModal(true);
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center pt-8">
            <EmptyState
              icon="folder-outline"
              title="No collections yet"
              description="Create a folder to save your ants"
              buttonTitle="Create Folder"
              onButtonPress={() => setShowCreate(true)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function ActionModal({
  folder,
  visible,
  onClose,
  onEdit,
  onDelete,
}: {
  folder: Folder;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-8">
        <View
          className="bg-white w-full rounded-2xl p-5"
          style={{
            shadowColor: "#90A1B9",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <View className="flex-col items-start gap-2">
            <Text className="text-lg font-bold text-center">{folder.name}</Text>
            <Text className="text-base mb-4 text-center">
              Manage this collection
            </Text>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <PrimaryButton
                title="Cancel"
                onPress={onClose}
                size="small"
                variant="outlined"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>
            <View className="flex-1">
              <PrimaryButton
                title="Delete"
                onPress={onDelete}
                size="small"
                fullWidth
                style={{
                  shadowColor: "transparent",
                  backgroundColor: "#EF4444",
                  borderColor: "transparent",
                }}
              />
            </View>
            <View className="flex-1">
              <PrimaryButton
                title="Edit"
                onPress={onEdit}
                size="small"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FolderCard({
  folder,
  onPress,
  onMore,
}: {
  folder: { id: string; name: string; color: string; itemCount?: number };
  onPress: () => void;
  onMore: () => void;
}) {
  const itemCount = folder.itemCount ?? 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{
        shadowColor: folder.color,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        className="h-28 w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: folder.color + "22" }}
      >
        <View
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full"
          style={{ backgroundColor: folder.color, opacity: 0.25 }}
        />
        <View
          className="absolute -top-4 -left-4 w-16 h-16 rounded-full"
          style={{ backgroundColor: folder.color, opacity: 0.15 }}
        />

        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: folder.color + "33" }}
        >
          <Text className="text-2xl font-bold" style={{ color: folder.color }}>
            {folder.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="px-3 py-3 ml-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text
              className="font-bold text-gray-900 text-base mb-0.5"
              numberOfLines={1}
            >
              {folder.name}
            </Text>
            <Text className="text-sm text-gray-500">{itemCount} species</Text>
          </View>

          <TouchableOpacity onPress={onMore} hitSlop={10}>
            <Ionicons name="ellipsis-vertical" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
