import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78;
const CARD_SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const GradientText = ({ text = '', style }) => {
  if (!text) return null;
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={['#792A2E', '#DF4E55', '#792A2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const defaultBannerAsset = require('../../assets/images/deals.png');

const getImageSource = (img) => {
  if (!img) return defaultBannerAsset;
  if (typeof img === 'string') return { uri: img, priority: FastImage.priority.high };
  return { ...img, priority: FastImage.priority.high };
};

const OfferCarousel = ({
  offers = [],
  onCardPress,
  showCaption = true,
  showPagination = true,
  fullWidth = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SNAP_INTERVAL);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={fullWidth ? width : SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={[styles.scrollContent, fullWidth && styles.fullWidthScrollContent]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {offers.map((item, index) => {
          const itemId = item.banner_id || item.id || index;
          const imgSource = getImageSource(item.image);
          const isLoaded = loadedImages[itemId];
          return (
            <TouchableOpacity
              key={itemId.toString()}
              activeOpacity={0.9}
              style={[styles.card, fullWidth && styles.fullWidthCard]}
              onPress={() => onCardPress?.(item)}
            >
              {/* Image */}
              <View style={[styles.cardImage, fullWidth && styles.fullWidthImage]}>
                {!isLoaded && (
                  <ShimmerPlaceholder
                    style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                    shimmerColor="#EAEAEA"
                    shimmerBackgroundColor="#F5F5F5"
                    visible={false}
                  />
                )}
                <FastImage
                  source={imgSource}
                  style={StyleSheet.absoluteFill}
                  resizeMode={FastImage.resizeMode.cover}
                  loop={true}
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [itemId]: true }))}
                />
              </View>

              {showCaption && (
                <View style={styles.textContainer}>
                  <Text style={styles.categoryText}>{item.category_name || item.category || 'Special Offer'}</Text>
                  <GradientText
                    text={item.offer || item.discount || 'FLAT DISCOUNT'}
                    style={styles.offerText}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      {showPagination && (
        <View style={styles.dotsContainer}>
          {offers.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: CARD_SPACING,
  },
  fullWidthScrollContent: {
    paddingHorizontal: 0,
    gap: 0,
  },
  card: {
    width: CARD_WIDTH,
  },
  fullWidthCard: {
    width,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullWidthImage: {
    width,
    height: 220,
    borderRadius: 0,
  },
  textContainer: {
    marginTop: -43,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#203320',
    textAlign: 'center',
  },
  offerText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  /* ===== Pagination Dots ===== */
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D5D5D5',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2CB7DF',
  },
});

export default OfferCarousel;

