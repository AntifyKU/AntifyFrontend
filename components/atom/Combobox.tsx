import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  ViewStyle,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/atom/SearchBar";
import Badge from "@/components/atom/badge/Badge";
import { useTranslation } from "react-i18next";

interface ComboboxProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
  getOptionLabel?: (value: string) => string;
}

export default function Combobox({
  label,
  placeholder,
  searchPlaceholder,
  options,
  selected,
  onToggle,
  error,
  containerStyle,
  getOptionLabel,
}: Readonly<ComboboxProps>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const resolvedPlaceholder =
    placeholder ?? t("filter.comboboxDefaultPlaceholder");
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? t("filter.provinceSearchPlaceholder");

  const resolveLabel = (value: string) =>
    getOptionLabel ? getOptionLabel(value) : value;

  const filtered = options.filter((opt) =>
    resolveLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

  const hasSelection = selected.length > 0;
  const borderColor = error ? "#EF4444" : isOpen ? "#0A9D5C" : "#E5E7EB";

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Trigger */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsOpen(true)}
        style={[styles.trigger, { borderColor }]}
      >
        <Text
          style={[styles.triggerText, !hasSelection && styles.placeholderText]}
          numberOfLines={1}
        >
          {hasSelection
            ? selected.length === 1
              ? resolveLabel(selected[0])
              : t("filter.comboboxSelectedCount", {
                  count: selected.length,
                })
            : resolvedPlaceholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={isOpen ? "#0A9D5C" : "#6B7280"}
        />
      </TouchableOpacity>

      {/* Selected badges shown below trigger */}
      {hasSelection && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.badgeScroll}
          contentContainerStyle={styles.badgeRow}
        >
          {selected.map((item) => (
            <Badge
              key={item}
              label={resolveLabel(item)}
              isSelected
              onPress={() => onToggle(item)}
              size="small"
            />
          ))}
        </ScrollView>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Bottom-sheet dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsOpen(false);
          setSearch("");
        }}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            setIsOpen(false);
            setSearch("");
          }}
        />

        {/* Sheet */}
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Search */}
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={resolvedSearchPlaceholder}
            containerClassName="px-4 mt-2 mb-1"
          />

          {/* Options list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {t("filter.comboboxNoResults")}
              </Text>
            }
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={1}
                  onPress={() => onToggle(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {resolveLabel(item)}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#22A45D" />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Done */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setIsOpen(false);
              setSearch("");
            }}
          >
            <Text style={styles.doneText}>{t("common.done")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    justifyContent: "space-between",
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    marginRight: 8,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  badgeScroll: {
    marginTop: 10,
  },
  badgeRow: {
    flexDirection: "row",
    paddingRight: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },

  // Modal
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 480,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  list: {
    maxHeight: 300,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
  },
  optionTextSelected: {
    color: "#22A45D",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    paddingVertical: 24,
  },
  doneButton: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#22A45D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});