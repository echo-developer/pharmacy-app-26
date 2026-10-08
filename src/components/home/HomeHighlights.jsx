import React, { useState } from 'react';
import {
  Dimensions,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const CARD_WIDTH = 128;
const CARD_GAP = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CARD_COLORS = [
  ['#E7F8FC', '#E9E3DC'],
  ['#8DF79B', '#E5E9DE'],
  ['#E8F8FC', '#E9E3DC'],
];
const NO_IMAGE = /no-image|placeholder/i;
const OfferGradientText = ({ children }) => (
  <MaskedView
    maskElement={<Text style={styles.offerText}>{children}</Text>}
  >
    <LinearGradient
      colors={['#792A2E', '#DF4E55', '#792A2E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.offerText, styles.transparentText]}>{children}</Text>
    </LinearGradient>
  </MaskedView>
);

const getCategoryHighlights = categories =>
  categories
    .map(category => {
      const products = Array.isArray(category.items) ? category.items : [];
      const productsWithImages = products.filter(
        item => item && typeof item.image === 'string' && item.image && !NO_IMAGE.test(item.image),
      );
      if (!productsWithImages.length) return null;

      const getDiscountPercent = item => {
        const mrp = Number(item?.product_mrp);
        const price = Number(item?.product_sell_price);
        if (!Number.isFinite(mrp) || mrp <= 0 || !Number.isFinite(price) || price >= mrp) {
          return 0;
        }
        return Math.round(((mrp - price) / mrp) * 100);
      };
      const product = productsWithImages.reduce((best, item) =>
        getDiscountPercent(item) > getDiscountPercent(best) ? item : best,
      );
      const discountPercent = getDiscountPercent(product);

      return {
        categoryId: category.category_id,
        categoryName: category.category_name,
        product,
        discountPercent,
      };
    })
    .filter(Boolean);

const HomeHighlights = ({ categories = [], onProductPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const highlights = getCategoryHighlights(categories);
  if (!highlights.length) return null;

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={event => {
          const x = event.nativeEvent.contentOffset.x;
          setActiveIndex(Math.min(highlights.length - 1, Math.max(0, Math.round(x / SNAP_INTERVAL))));
        }}
      >
        {highlights.map((highlight, index) => {
          const colors = CARD_COLORS[index % CARD_COLORS.length];
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ],
            outputRange: [0.9, 1.12, 0.9],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`${highlight.categoryId || highlight.product.product_id}`}
              style={[styles.cardScale, { transform: [{ scale }] }]}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={styles.card}
                onPress={() => onProductPress?.(highlight.product)}
              >
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.cardBackground}
                >
                  <View style={styles.imageArea}>
                    <Image
                      source={{ uri: highlight.product.image }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.categoryName}>
                    {highlight.categoryName || highlight.product.product_name}
                  </Text>
                  <OfferGradientText>
                    {highlight.discountPercent > 0
                      ? `UP TO ${highlight.discountPercent}% OFF`
                      : 'SHOP NOW'}
                  </OfferGradientText>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      {highlights.length > 1 && (
        <View style={styles.dots}>
          {highlights.map((highlight, index) => (
            <View
              key={`${highlight.categoryId || index}-dot`}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: (Dimensions.get('window').width - CARD_WIDTH) / 2,
    gap: CARD_GAP,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardScale: {
    width: CARD_WIDTH,
    alignItems: 'center',
    zIndex: 1,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 6,
  },
  cardBackground: {
    width: '100%',
    minHeight: 162,
    alignItems: 'center',
    paddingBottom: 6,
    borderRadius: 12,
  },
  imageArea: {
    width: '100%',
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '96%',
    height: '100%',
  },
  categoryName: {
    width: '100%',
    color: '#26332A',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 5,
    marginTop: 2,
    lineHeight: 16,
  },
  offerText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  transparentText: {
    opacity: 0,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D5D5D5',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#2CB7DF',
  },
});

export default HomeHighlights;
