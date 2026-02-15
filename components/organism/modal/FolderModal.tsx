import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { FOLDER_COLORS } from "@/services/folders";
import TextInput from "@/components/atom/TextInput";

interface FolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
  title?: string;
  submitLabel?: string;
}

export default function FolderModal({
  visible,
  onClose,
  onSubmit,
  initialName = "",
  initialColor,
  title = "Create Folder",
  submitLabel = "Save",
}: FolderModalProps) {
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
      setNameError("Please enter a collection name");
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
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className="bg-white w-full rounded-2xl p-5"
          style={{
            borderWidth: 1,
            borderColor: "#90A1B9",
            shadowColor: "#90A1B9",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <TextInput
            label="Collection Name"
            placeholder="Enter your collection name"
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
            Color
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FOLDER_COLORS.map((c) => {
              const isSelected = color === c.hex;

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
                      borderColor: isSelected
                        ? "#0A9D5C"
                        : colorError
                          ? "#EF4444"
                          : "transparent",
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
              Please select a color
            </Text>
          )}

          {/* Actions */}
          <View className="flex-row mt-6">
            <View className="flex-1 mr-2">
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
                title={submitLabel}
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
