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
import LinearGradient from 'react-native-linear-gradient';

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
        return (
          <TouchableOpacity
            key={itemId.toString()}
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => onCardPress?.(item)}
          >
            <LinearGradient
              colors={item.gradient || (index % 2 === 0 ? ['#FDEBEC', '#FAD1D2'] : ['#E8EEFC', '#D0DEF9'])}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardShape}
            />
            <CachedImage
              source={imgSource}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Text style={styles.cardLabel}>{item.label || item.category_name || item.name || 'Health Concern'}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingTop: 14,
    paddingBottom: 8,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 1.04,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardShape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '78%',
    borderRadius: 20,
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '78%',
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#302426',
    paddingHorizontal: 12,
    paddingBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
});

export default HealthConcernList;
