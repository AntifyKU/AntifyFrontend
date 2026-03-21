import React from 'react';
import Badge from './Badge';
import { useTranslation } from "react-i18next";

interface TagsBadgeProps {
  readonly tag: string;
  readonly onPress?: () => void;
  readonly size?: 'small' | 'medium' | 'large';
}

/**
 * A specialized Badge component for displaying ant species tags.
 */
export default function TagsBadge({ tag, onPress = () => { }, size = 'small' }: TagsBadgeProps) {
  const { t } = useTranslation();
  const translatedTag = t(`badges.${tag}`, { defaultValue: tag });

  // We can customize colors based on tag categories if needed in the future
  return (
    <Badge
      label={translatedTag}
      onPress={onPress}
      size={size}
      showCloseIcon={false}
      isSelected={true}
      selectedBackgroundColor="#0A9D5C"
    />
  );
}
