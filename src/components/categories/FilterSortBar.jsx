import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SlidersHorizontal, Check } from 'lucide-react-native';

const FilterSortBar = ({
  onFilterPress,
  onSortPress,
  currentSort = 'relevance',
  isInStockOnly = false,
  onInStockToggle,
  hasActiveFilters = false,
}) => {
  const getSortLabel = () => {
    switch (currentSort) {
      case 'price_asc':
        return 'Sort: Low to High';
      case 'price_desc':
        return 'Sort: High to Low';
      case 'name_asc':
        return 'Sort: Name (A-Z)';
      case 'name_desc':
        return 'Sort: Name (Z-A)';
      default:
        return 'Sort: Relevance';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filters Button */}
        <TouchableOpacity
          style={[styles.pill, hasActiveFilters && styles.pillActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={14} color={hasActiveFilters ? '#FFFFFF' : '#043250'} />
          <Text style={[styles.pillText, hasActiveFilters && styles.pillTextActive]}>
            Filters{hasActiveFilters ? ' •' : ''}
          </Text>
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity
          style={[styles.pill, currentSort !== 'relevance' && styles.pillActive]}
          onPress={onSortPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.pillText, currentSort !== 'relevance' && styles.pillTextActive]}>
            {getSortLabel()}
          </Text>
        </TouchableOpacity>

        {/* In Stock Filter Chip */}
        <TouchableOpacity
          style={[styles.pill, isInStockOnly && styles.pillActive]}
          onPress={onInStockToggle}
          activeOpacity={0.8}
        >
          {isInStockOnly && <Check size={14} color="#FFFFFF" style={{ marginRight: 2 }} />}
          <Text style={[styles.pillText, isInStockOnly && styles.pillTextActive]}>
            In Stock
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  scrollContent: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E7EE',
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#043250',
    borderColor: '#043250',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#043250',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default FilterSortBar;