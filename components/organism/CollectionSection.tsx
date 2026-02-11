import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFolders } from "@/hooks/useFolders";
import { useCollection } from "@/hooks/useCollection";
import { Folder, FOLDER_COLORS } from "@/services/folders";
import EmptyState from "@/components/molecule/EmptyState";

interface Props {
  folders: Folder[];
  isLoading: boolean;
  itemWidth: number;
}

export default function CollectionSection({
  folders,
  isLoading,
  itemWidth,
}: Props) {
  const { createFolder, deleteFolder, refresh: refreshFolders } = useFolders();
  const { refresh: refreshCollection } = useCollection();

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0].hex);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createFolder(name, color, "folder");
      setName("");
      setShowCreate(false);
      await refreshFolders();
    } finally {
      setSaving(false);
    }
  };

  const handleLongPress = (folder: Folder) => {
    const onDelete = (withItems: boolean) => {
      Alert.alert(
        "Delete Folder",
        `Are you sure you want to delete "${folder.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteFolder(folder.id, withItems);
                if (withItems) await refreshCollection();
                await refreshFolders();
              } catch (error: any) {
                Alert.alert("Error", error.message);
              }
            },
          },
        ],
      );
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Delete (Keep Items)",
            "Delete (Remove Everything)",
          ],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          title: folder.name,
        },
        (index) => {
          if (index === 1) onDelete(false);
          if (index === 2) onDelete(true);
        },
      );
    } else {
      Alert.alert(folder.name, "Choose an action", [
        { text: "Cancel", style: "cancel" },
        { text: "Keep Items", onPress: () => onDelete(false) },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => onDelete(true),
        },
      ]);
    }
  };

  if (isLoading && folders.length === 0) {
    return <ActivityIndicator className="mt-10" size="large" color="#22A45D" />;
  }

  return (
    <>
      <Modal visible={showCreate} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[85%]">
            <Text className="font-bold text-lg mb-3">New Folder</Text>
            <TextInput
              placeholder="Folder name"
              value={name}
              onChangeText={setName}
              className="border border-gray-200 rounded px-3 py-2 mb-4"
            />
            <View className="flex-row mb-6 justify-between">
              {FOLDER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c.hex}
                  onPress={() => setColor(c.hex)}
                  className={`w-10 h-10 rounded-full ${color === c.hex ? "border-2 border-black" : ""}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowCreate(false)}
                className="flex-1 p-3 border border-gray-200 rounded"
              >
                <Text className="text-center text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                disabled={saving}
                className="flex-1 bg-[#22A45D] p-3 rounded"
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Create
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="px-5">
        {folders.length === 0 ? (
          <EmptyState
            icon="folder-outline"
            title="No collections yet"
            buttonTitle="Create Folder"
            onButtonPress={() => setShowCreate(true)}
          />
        ) : (
          <View className="flex-row flex-wrap">
            {folders.map((folder, i) => (
              <TouchableOpacity
                key={folder.id}
                style={{ width: itemWidth, marginRight: i % 2 === 0 ? 12 : 0 }}
                onPress={() =>
                  router.push({
                    pathname: "/collection/[id]",
                    params: { id: folder.id },
                  })
                }
                onLongPress={() => handleLongPress(folder)}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                <Ionicons name="folder" size={42} color={folder.color} />
                <Text className="mt-2 font-semibold" numberOfLines={1}>
                  {folder.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          className="mt-2 bg-[#22A45D] p-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold">+ Create Folder</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
