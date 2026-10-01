import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SubcategorySelector = ({
  categoryName,
  subcategories = [],
  selectedSubcategoryId,
  isShopAllSelected,
  onSubcategoryPress,
  onShopAllPress,
}) => (
  <View style={styles.container}>
    <View style={styles.headingRow}>
      <Text style={styles.heading} numberOfLines={1}>{categoryName || 'Category'}</Text>
      <TouchableOpacity
        style={[styles.shopAllButton, isShopAllSelected && styles.shopAllButtonActive]}
        onPress={onShopAllPress}
        accessibilityRole="button"
        accessibilityState={{ selected: !!isShopAllSelected }}
      >
        <Text style={[styles.shopAll, isShopAllSelected && styles.shopAllActive]}>Shop all</Text>
      </TouchableOpacity>
    </View>
    {subcategories.length > 0 && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subcategoryRow}
      >
        {subcategories.map((subcategory, index) => {
          const id = subcategory.sub_category_id || subcategory.category_id || subcategory.id || index;
          const selected = String(id) === String(selectedSubcategoryId);
          const name = subcategory.sub_category_name || subcategory.category_name || subcategory.name || 'Category';
          return (
            <TouchableOpacity
              key={String(id)}
              style={[styles.chip, selected && styles.selectedChip]}
              onPress={() => onSubcategoryPress?.(subcategory)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.selectedChipText]} numberOfLines={1}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  heading: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#043250',
  },
  shopAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DEE8',
    backgroundColor: '#F7F8FC',
  },
  shopAllButtonActive: {
    borderColor: '#043250',
    backgroundColor: '#043250',
  },
  shopAll: {
    color: '#0D7998',
    fontSize: 12,
    fontWeight: '700',
  },
  shopAllActive: {
    color: '#FFFFFF',
  },
  subcategoryRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    maxWidth: 180,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8DEE8',
    backgroundColor: '#F7F8FC',
  },
  selectedChip: {
    backgroundColor: '#043250',
    borderColor: '#043250',
  },
  chipText: {
    color: '#043250',
    fontSize: 11,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
});

export default SubcategorySelector;
