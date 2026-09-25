import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const defaultPills = [
  { id: 1, label: 'Diabetes Care' },
  { id: 2, label: 'Cardiac Care' },
  { id: 3, label: 'Stomach Care' },
  { id: 4, label: 'Skin Care' },
  { id: 5, label: 'Eye Care' },
];

const ConcernPills = ({ concerns = [], pills = [], onPillPress }) => {
  const [activeId, setActiveId] = useState(null);

  const dataList = (concerns && concerns.length > 0)
    ? concerns
    : (pills && pills.length > 0 ? pills : defaultPills);

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
        const isActive = itemId === activeId;
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