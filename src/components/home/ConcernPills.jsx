import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const pills = [
  { id: 1, label: 'OTC Medicines' },
  { id: 2, label: 'Vitamins & Supplements' },
  { id: 3, label: 'Balance' },
  { id: 4, label: 'Diabetes Care' },
];

const ConcernPills = ({ onPillPress }) => {
  const [activeId, setActiveId] = useState(1);

  const handlePress = (item) => {
    setActiveId(item.id);
    onPillPress?.(item);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {pills.map((item) => {
        const isActive = item.id === activeId;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
            onPress={() => handlePress(item)}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {item.label}
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