import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DealsHeader from './DealsHeader';
import DealsProducts from './DealsProducts';

const ALL_TAB_ID = '__all__';

const PopularMedicineSection = ({
  popularMedicines = [],
  categories = [],
  onAddPress,
  onProductPress,
  onArrowPress,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_TAB_ID);
  const selectedCategory = categories.find(
    category => String(category.category_id) === String(selectedCategoryId),
  );
  const products = selectedCategory
    ? (Array.isArray(selectedCategory.items) ? selectedCategory.items : [])
    : popularMedicines;

  return (
    <View>
      <DealsHeader
        title="Popular Medicine You Can Trust"
        subtitle="Popular medicines selected for you"
        showHeart={false}
        onArrowPress={onArrowPress}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        <TouchableOpacity
          style={[styles.tab, selectedCategoryId === ALL_TAB_ID && styles.activeTab]}
          onPress={() => setSelectedCategoryId(ALL_TAB_ID)}
        >
          <Text style={[styles.tabText, selectedCategoryId === ALL_TAB_ID && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        {categories.map(category => {
          const categoryId = String(category.category_id);
          const isActive = categoryId === String(selectedCategoryId);
          return (
            <TouchableOpacity
              key={categoryId}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setSelectedCategoryId(category.category_id)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]} numberOfLines={1}>
                {category.category_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {products.length > 0 ? (
        <DealsProducts
          products={products}
          onAddPress={onAddPress}
          onProductPress={onProductPress}
        />
      ) : (
        <Text style={styles.emptyText}>No medicines available in this category.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    maxWidth: 220,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    borderColor: '#263077',
    backgroundColor: '#263077',
  },
  tabText: {
    color: '#52616B',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    color: '#787887',
    fontSize: 13,
  },
});

export default PopularMedicineSection;
