import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = ['Overview', 'Uses', 'Side Effects'];

const ProductTabs = ({ onTabPress }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handlePress = (index) => {
    setActiveTab(index);
    onTabPress?.(TABS[index]);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => handlePress(index)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabText, isActive && styles.tabTextActive]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',       
    borderRadius: 30,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#263077',      
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263077',                 
  },
  tabTextActive: {
    color: '#FFFFFF',                 
  },
});

export default ProductTabs;