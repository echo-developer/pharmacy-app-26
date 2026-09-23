import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react-native';

const FilterSortBar = ({ onFilterPress, onSortPress }) => {
  return (
    <View style={styles.container}>
      {/* Filter Pill */}
      <TouchableOpacity
        style={styles.pill}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <SlidersHorizontal size={16} color="#263077" />
        <Text style={styles.pillText}>Filter</Text>
      </TouchableOpacity>

      {/* Sort Pill */}
      <TouchableOpacity
        style={styles.pill}
        onPress={onSortPress}
        activeOpacity={0.8}
      >
        <ArrowUpDown size={16} color="#263077" />
        <Text style={styles.pillText}>Sort</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',       // Bar background
    gap: 10,
    borderWidth: 1,
    borderColor: '#AFF4E6',           // Pure screen ka border
    // borderRadius: 12,                 // Optional rounded corner
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FF',       // Pill background
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263077',
  },
});

export default FilterSortBar;