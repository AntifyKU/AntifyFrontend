import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Folder, FOLDER_COLORS } from "@/services/folders";
import EmptyState from "@/components/molecule/EmptyState";

interface Props {
  folders: Folder[];
  isLoading: boolean;
  itemWidth: number;
  createFolder: (name: string, color: string, icon: string) => Promise<void>;
  updateFolder: (id: string, updates: { name?: string; color?: string }) => Promise<void>;
  handleFolderLongPress: (folder: Folder) => void;
}

export default function CollectionSection({
  folders,
  isLoading,
  itemWidth,
  createFolder,
  updateFolder,
  handleFolderLongPress,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0].hex);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await createFolder(name, color, "folder");
    setSaving(false);
    setName("");
    setShowCreate(false);
  };

  if (isLoading) {
    return <ActivityIndicator className="mt-10" size="large" color="#22A45D" />;
  }

  return (
    <>
      {/* Create Folder Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[85%]">
            <Text className="font-bold text-lg mb-3">New Folder</Text>
            <TextInput
              placeholder="Folder name"
              value={name}
              onChangeText={setName}
              className="border rounded px-3 py-2 mb-4"
            />

            <View className="flex-row mb-4">
              {FOLDER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c.hex}
                  onPress={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-full mr-2 ${color === c.hex ? "border-2 border-black" : ""}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleCreate}
              disabled={saving}
              className="bg-[#22A45D] p-3 rounded"
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Create</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Folder Grid */}
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
                onLongPress={() => handleFolderLongPress(folder)}
                className="bg-white rounded-xl p-4 mb-4 shadow"
              >
                <Ionicons name="folder" size={42} color={folder.color} />
                <Text className="mt-2 font-semibold">{folder.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          className="mt-4 bg-[#22A45D] p-4 rounded-xl"
        >
          <Text className="text-white text-center font-medium">
            + Create Folder
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}