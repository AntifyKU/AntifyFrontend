/**
 * FavoriteListCard Component
 * A list card for favorites with a heart button to remove
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteListCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  onPress: () => void;
  onRemove: () => void;
  isRemoving?: boolean;
}

export default function FavoriteListCard({
  id,
  title,
  description,
  image,
  onPress,
  onRemove,
  isRemoving = false,
}: FavoriteListCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
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

      {/* Heart Button to Remove */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={onRemove}
        disabled={isRemoving}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isRemoving ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <Ionicons name="heart" size={22} color="#EF4444" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E8F5E0',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontStyle: 'italic',
  },
  heartButton: {
    padding: 8,
    marginRight: 4,
  },
});
