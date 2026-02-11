import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "favorite" | "menu";

interface ProfileItemCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  onPress: () => void;
  variant?: Variant;
  onRemove?: () => void;
  isRemoving?: boolean;
  onDeleteHistory?: () => void;
  isLoading?: boolean;
}

export default function ProfileItemCard({
  title,
  description,
  image,
  onPress,
  variant = "menu",
  onRemove,
  isRemoving = false,
  onDeleteHistory,
  isLoading = false,
}: ProfileItemCardProps) {
  const handleMenu = () => {
    Alert.alert("Delete history?", "This action cannot be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDeleteHistory,
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image */}
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="bug" size={24} color="#328e6e" />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>

      {/* Right Action */}
      {variant === "favorite" ? (
        <TouchableOpacity
          style={styles.action}
          onPress={onRemove}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="heart" size={22} color="#EF4444" />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.action}
          onPress={handleMenu}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#6B7280" />
          ) : (
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#E8F5E0",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    fontStyle: "italic",
  },
  action: {
    padding: 8,
    marginRight: 4,
  },
});
