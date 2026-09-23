import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CategoryItem = ({ label = 'All', isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Gradient Circle with Image */}
      <LinearGradient
        colors={['#F5F4F2', '#FFD89D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.34, 1]}
        style={styles.circle}
      >
        <Image
          source={require('../../assets/images/petsupplements.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 80,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  itemActive: {
    backgroundColor: '#FFFFFF',
    width: 80,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '70%',
    height: '70%',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#263077',      // Same color for active & inactive
    marginTop: 6,
  },
});

export default CategoryItem;