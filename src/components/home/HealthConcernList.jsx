import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CachedImage } from '../common/CachedImage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const concernAssets = [
  { match: /allerg/i, image: require('../../assets/images/allergy.png') },
  { match: /cold|cough/i, image: require('../../assets/images/cold&cough.png') },
  { match: /pain/i, image: require('../../assets/images/painrelief.png') },
];
const defaultAsset = concernAssets[0].image;

const getImageSource = (img) => {
  if (!img) return defaultAsset;
  if (typeof img === 'string') return { uri: img };
  return img;
};

const getConcernImage = item => {
  if (item.image) return getImageSource(item.image);
  const label = item.label || item.category_name || item.name || '';
  return concernAssets.find(asset => asset.match.test(label))?.image || defaultAsset;
};

const HealthConcernList = ({ concerns = [], onCardPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {concerns.map((item, index) => {
        const itemId = item.category_id || item.id || item.product_id || index;
        const imgSource = getConcernImage(item);
        const distanceFromCenter = index - (concerns.length - 1) / 2;
        const tilt = distanceFromCenter === 0
          ? '0deg'
          : `${distanceFromCenter < 0 ? '-' : ''}${Math.min(Math.abs(distanceFromCenter) * 6, 12)}deg`;
        const arcOffset = Math.min(Math.abs(distanceFromCenter) * 10, 30);
        return (
          <TouchableOpacity
            key={itemId.toString()}
            activeOpacity={0.9}
            style={[styles.cardWrapper, { transform: [{ translateY: arcOffset }] }]}
            onPress={() => onCardPress?.(item)}
          >
            <CachedImage
              source={imgSource}
              style={[styles.cardImage, { transform: [{ rotate: tilt }] }]}
              resizeMode="contain"
            />
            <View style={styles.cardLabelContainer}>
              <Text
                style={[styles.cardLabel, { transform: [{ rotate: tilt }] }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {String(item.label || item.category_name || item.name || 'Health Concern').trim()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
    paddingTop: 14,
    paddingBottom: 32,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 1.04,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardImage: {
    position: 'absolute',
    top: '-4%',
    left: '-10%',
    width: '120%',
    height: '108%',
    borderRadius: 24,
  },
  cardLabelContainer: {
    position: 'absolute',
    bottom: '18%',
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
    transform: [{ translateX: -10 }],
  },
  cardLabel: {
    width: '100%',
    fontSize: 14,
    fontWeight: '700',
    color: '#302426',
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'transparent',
    textAlign: 'center',
    maxWidth: '100%',
  },
});

export default HealthConcernList;
