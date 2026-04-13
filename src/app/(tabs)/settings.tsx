import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';

import { Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useCategories } from '../../hooks';
import { GlassCard } from '../../components';
import { ICON_REGISTRY, QUICK_ICON_NAMES } from '../../utils';
import { colors, spacing, radii, typography, palette } from '../../types/theme';
import type { Category } from '../../types/task';

export default function SettingsScreen() {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<string>(palette[0]);
  const [newIcon, setNewIcon] = useState<string>(QUICK_ICON_NAMES[0]);

  const handleSave = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addCategory({ name: trimmed, color: newColor, icon: newIcon });
    setNewName('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newName, newColor, newIcon, addCategory]);

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => {
      const IconComp = ICON_REGISTRY[item.icon];
      return (
        <GlassCard tintColor={item.color}>
          <View style={localStyles.categoryRow}>
            {IconComp && <IconComp size={20} color={item.color} />}
            <Text style={[localStyles.categoryName, { color: item.color }]}>{item.name}</Text>
            <Pressable
              style={localStyles.deleteButton}
              onPress={() => {
                Haptics.selectionAsync();
                deleteCategory(item.id);
              }}
              hitSlop={8}
            >
              <Trash2 size={16} color={colors.danger} />
            </Pressable>
          </View>
        </GlassCard>
      );
    },
    [deleteCategory]
  );

  const keyExtractor = useCallback((item: Category) => item.id, []);

  return (
    <SafeAreaView style={localStyles.container} edges={['top']}>
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>Settings</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={keyExtractor}
        contentContainerStyle={localStyles.listContent}
        ListEmptyComponent={
          <Text style={localStyles.emptyText}>No categories yet</Text>
        }
        style={localStyles.list}
      />

      <View style={localStyles.creator}>
        <Text style={localStyles.creatorTitle}>New Category</Text>
        <TextInput
          style={localStyles.nameInput}
          value={newName}
          onChangeText={setNewName}
          placeholder="Category name"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.swatchRow}
        >
          {palette.map((c) => (
            <Pressable
              key={c}
              style={[
                localStyles.swatch,
                { backgroundColor: c },
                newColor === c && localStyles.swatchActive,
              ]}
              onPress={() => setNewColor(c)}
            />
          ))}
        </ScrollView>
        <View style={localStyles.iconGrid}>
          {QUICK_ICON_NAMES.map((iconName) => {
            const IC = ICON_REGISTRY[iconName];
            const isSelected = newIcon === iconName;
            return (
              <Pressable
                key={iconName}
                style={[localStyles.iconItem, isSelected && localStyles.iconItemActive]}
                onPress={() => setNewIcon(iconName)}
              >
                <IC size={20} color={isSelected ? newColor : colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
        <Pressable
          style={[localStyles.saveButton, !newName.trim() && localStyles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!newName.trim()}
        >
          <Text style={localStyles.saveButtonText}>Save Category</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  categoryName: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  creator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceElevated,
  },
  creatorTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  nameInput: {
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    marginBottom: spacing.xs,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  swatch: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: colors.textPrimary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  iconItem: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItemActive: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  saveButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
});
