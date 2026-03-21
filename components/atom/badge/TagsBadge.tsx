import React from 'react';
import Badge from './Badge';

interface TagsBadgeProps {
  readonly tag: string;
  readonly onPress?: () => void;
  readonly size?: 'small' | 'medium' | 'large';
}

/**
 * A specialized Badge component for displaying ant species tags.
 */
export default function TagsBadge({ tag, onPress = () => { }, size = 'small' }: TagsBadgeProps) {
  // We can customize colors based on tag categories if needed in the future
  return (
    <Badge
      label={tag}
      onPress={onPress}
      size={size}
      showCloseIcon={false}
      isSelected={true}
      selectedBackgroundColor="#0A9D5C"
    />
  );
}
