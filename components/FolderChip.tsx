/**
 * FolderChip Component
 * Displays a folder as a selectable chip/pill
 */

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Folder } from '@/services/folders';

interface FolderChipProps {
  folder: Folder;
  isSelected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export function FolderChip({ folder, isSelected, onPress, onLongPress }: FolderChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
        isSelected ? 'bg-opacity-100' : 'bg-gray-100'
      }`}
      style={isSelected ? { backgroundColor: folder.color } : undefined}
    >
      {/* Color dot or icon */}
      {!isSelected && (
        <View 
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: folder.color }}
        />
      )}
      
      {/* Folder name */}
      <Text 
        className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}
        numberOfLines={1}
      >
        {folder.name}
      </Text>
      
      {/* Item count badge */}
      {folder.item_count > 0 && (
        <View 
          className={`ml-2 px-1.5 py-0.5 rounded-full min-w-[20px] items-center ${
            isSelected ? 'bg-white/30' : 'bg-gray-200'
          }`}
        >
          <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
            {folder.item_count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// "All" chip for showing all collection items
interface AllChipProps {
  isSelected: boolean;
  onPress: () => void;
  itemCount: number;
}

export function AllChip({ isSelected, onPress, itemCount }: AllChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
        isSelected ? 'bg-[#22A45D]' : 'bg-gray-100'
      }`}
    >
      <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
        All
      </Text>
      <View 
        className={`ml-2 px-1.5 py-0.5 rounded-full min-w-[20px] items-center ${
          isSelected ? 'bg-white/30' : 'bg-gray-200'
        }`}
      >
        <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
          {itemCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Add folder button
interface AddFolderChipProps {
  onPress: () => void;
}

export function AddFolderChip({ onPress }: AddFolderChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-3 py-2 rounded-full border border-dashed border-gray-300"
    >
      <Ionicons name="add" size={16} color="#6B7280" />
      <Text className="text-sm text-gray-500 ml-1">New</Text>
    </TouchableOpacity>
  );
}

export default FolderChip;
