import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';

const CategoriesSidebar = ({ categories = [], activeCategory = 'all', onCategoryPress, style }) => {
  return (
    <ScrollView
      style={[styles.sidebar, style]}
      contentContainerStyle={styles.sidebarContent}
      showsVerticalScrollIndicator={false}
    >
      {categories.map((cat) => (
        <CategoryItem
          key={cat.category_id || cat.id}
          label={cat.category_name || cat.label}
          isActive={activeCategory === (cat.category_id || cat.id)}
          onPress={() => onCategoryPress?.(cat.category_id || cat.id)}
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