/**
 * SwipeableListCard Component
 * A list card with swipe-to-delete functionality
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SWIPE_THRESHOLD = -60;
const DELETE_BUTTON_WIDTH = 80;

interface SwipeableListCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  onPress: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function SwipeableListCard({
  id,
  title,
  description,
  image,
  onPress,
  onDelete,
  isDeleting = false,
}: SwipeableListCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes with significant movement
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const hasMovedEnough = Math.abs(gestureState.dx) > 15;
        return isHorizontalSwipe && hasMovedEnough;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Capture the gesture if it's clearly horizontal
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3);
        const hasMovedEnough = Math.abs(gestureState.dx) > 20;
        return isHorizontalSwipe && hasMovedEnough;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(isOpen.current ? -DELETE_BUTTON_WIDTH : 0);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative dx) and limit the range
        const newValue = Math.min(0, Math.max(-DELETE_BUTTON_WIDTH, gestureState.dx));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        
        if (gestureState.dx < SWIPE_THRESHOLD || (isOpen.current && gestureState.dx < 0)) {
          // Open delete button
          Animated.spring(translateX, {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: true,
            friction: 8,
          }).start();
          isOpen.current = true;
        } else {
          // Close delete button
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
          isOpen.current = false;
        }
      },
      onPanResponderTerminate: () => {
        // Reset if gesture is terminated
        translateX.flattenOffset();
        Animated.spring(translateX, {
          toValue: isOpen.current ? -DELETE_BUTTON_WIDTH : 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const closeSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
    isOpen.current = false;
  };

  const handlePress = () => {
    if (isOpen.current) {
      closeSwipe();
    } else {
      onPress();
    }
  };

  const handleDelete = () => {
    console.log('[SwipeableListCard] Delete pressed for id:', id);
    closeSwipe();
    onDelete();
  };

  return (
    <View style={styles.container}>
      {/* Delete Button (behind the card) */}
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={24} color="#fff" />
              <Text style={styles.deleteText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Card Content (swipeable) */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={handlePress}
          activeOpacity={0.9}
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

          {/* Heart Icon (to indicate it's a favorite) */}
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={18} color="#EF4444" />
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 12,
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: DELETE_BUTTON_WIDTH,
    height: '100%',
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  heartIcon: {
    marginRight: 8,
  },
});
