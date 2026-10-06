import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import LinearGradient from 'react-native-linear-gradient';

const NO_IMAGE_URL = 'https://pharmacy-shop.echodeveloper.com/useruploads/default/no-image-150x150.jpg';

const CategoryItem = ({ label = 'All', image, isActive, onPress }) => {
  const imageUrl = typeof image === 'string' ? image.trim() : '';
  const normalizedImageUrl = imageUrl.replace(/^http:\/\/localhost(?::\d+)?/i, 'https://pharmacy-shop.echodeveloper.com');
  const imageSource = { uri: normalizedImageUrl || NO_IMAGE_URL };

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
          source={imageSource}
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
