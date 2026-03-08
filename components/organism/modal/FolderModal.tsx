import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { FOLDER_COLORS, Folder } from "@/services/folders";
import TextInput from "@/components/atom/TextInput";
import { useTranslation } from "react-i18next";

interface FolderModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (name: string, color: string) => void;
  readonly initialName?: string;
  readonly initialColor?: string;
  readonly title?: string;
  readonly submitLabel?: string;
}

export default function FolderModal({
  visible,
  onClose,
  onSubmit,
  initialName = "",
  initialColor,
  title,
  submitLabel,
}: FolderModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [colorError, setColorError] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialName ?? "");
      setColor(initialColor ?? null);
      setNameError("");
      setColorError(false);
    }
  }, [visible, initialName, initialColor]);

  const handleSubmit = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError(t("collection.folder.nameRequired"));
      valid = false;
    }

    if (!color) {
      setColorError(true);
      valid = false;
    }

    if (!valid) return;

    onSubmit(name.trim(), color as string);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-8">
        <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">
              {title ?? t("collection.folder.createTitle")}
            </Text>
          </View>

          {/* Name */}
          <TextInput
            label={t("collection.folder.folderName")}
            placeholder={t("collection.folder.namePlaceholder")}
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (t.trim()) setNameError("");
            }}
            error={nameError}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={{ marginBottom: 16 }}
          />

          {/* Color */}
          <Text className="text-base text-gray-600 font-medium mb-2">
            {t("collection.folder.colorLabel")}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FOLDER_COLORS.map((c) => {
              const isSelected = color === c.hex;

              let borderColor = "transparent";
              if (isSelected) {
                borderColor = "#0A9D5C";
              } else if (colorError) {
                borderColor = "#EF4444";
              }

              return (
                <TouchableOpacity
                  key={c.hex}
                  onPress={() => {
                    setColor(c.hex);
                    setColorError(false);
                  }}
                  className="mr-3 items-center"
                >
                  <View
                    className="w-10 h-10 rounded-full border-2"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: borderColor,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {colorError && (
            <Text
              style={{
                color: "#EF4444",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {t("collection.folder.colorRequired")}
            </Text>
          )}

          {/* Actions */}
          <View className="flex-row mt-6">
            <View className="flex-1 mr-2">
              <PrimaryButton
                title={t("common.cancel")}
                onPress={onClose}
                size="small"
                variant="outlined"
                fullWidth
                style={{ shadowColor: "transparent" }}
              />
            </View>

            <View className="flex-1">
              <PrimaryButton
                title={submitLabel ?? t("common.save")}
                onPress={handleSubmit}
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

export const modalShadow = {
  shadowColor: "#90A1B9",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

interface FolderActionModalProps {
  readonly folder: Folder;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export function FolderActionModal({
  folder,
  visible,
  onClose,
  onEdit,
  onDelete,
}: FolderActionModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-8">
        <View className="bg-white w-full rounded-2xl p-5" style={modalShadow}>
          <Text className="text-lg font-bold mb-0.5">{folder.name}</Text>
          <Text className="text-sm text-gray-500 mb-5">
            {t("collection.folder.manageSubtitle")}
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={onEdit}
          >
            <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
            </View>
            <Text className="text-base text-gray-800">
              {t("collection.folder.editAction")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={onDelete}
          >
            <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </View>
            <Text className="text-base text-red-500">
              {t("collection.folder.deleteAction")}
            </Text>
          </TouchableOpacity>

          <View className="mt-3">
            <PrimaryButton
              title={t("common.cancel")}
              onPress={onClose}
              size="small"
              variant="outlined"
              fullWidth
              style={{ shadowColor: "transparent" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
