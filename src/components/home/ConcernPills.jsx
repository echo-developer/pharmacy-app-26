import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const defaultPills = [
  { id: 'otc', label: 'OTC Medicines' },
  { id: 'vitamins', label: 'Vitamins & Supplements' },
  { id: 'baby', label: 'Baby Care' },
];

const ConcernPills = ({ concerns = [], pills = [], onPillPress }) => {
  const [activeId, setActiveId] = useState(null);

  const dataList = (concerns && concerns.length > 0)
    ? concerns
    : (pills && pills.length > 0 ? pills : defaultPills);
  const selectedId = activeId ?? (dataList[0]?.category_id || dataList[0]?.id || 0);

  const handlePress = (item, index) => {
    const id = item.category_id || item.id || index;
    setActiveId(id);
    onPillPress?.(item);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {dataList.map((item, index) => {
        const itemId = item.category_id || item.id || index;
        const isActive = itemId === selectedId;
        return (
          <TouchableOpacity
            key={itemId.toString()}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
            onPress={() => handlePress(item, index)}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {item.label || item.category_name || item.name || item.title || 'Concern'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: '#263077',   // Active pill background
    borderColor: '#263077',
  },
  pillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F2DBDB',       // Inactive pill border
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillTextInactive: {
    color: '#7A6666',             // Inactive pill text
  },
});

export default ConcernPills;
