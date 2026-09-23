import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'All' },
  { id: 'health', label: 'All' },
  { id: 'baby', label: 'All' },
  { id: 'devices', label: 'All' },
  { id: 'ayurveda', label: 'All' },
  { id: 'nutrition', label: 'All' },
];

const CategoriesSidebar = ({ activeCategory = 'all', onCategoryPress, style }) => {
  return (
    <ScrollView
      style={[styles.sidebar, style]}
      contentContainerStyle={styles.sidebarContent}
      showsVerticalScrollIndicator={false}
    >
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          label={cat.label}
          isActive={activeCategory === cat.id}
          onPress={() => onCategoryPress?.(cat.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    maxWidth: 80,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: '#F2F3F9',
  },
  sidebarContent: {
    paddingVertical: 8,
  },
});

export default CategoriesSidebar;