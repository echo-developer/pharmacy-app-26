import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 24;
const CARD_WIDTH = SCREEN_WIDTH * 0.5;
const CARD_HEIGHT = 180;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const getAvailableCount = item => (
  item.available_count
  ?? item.available_medicines_count
  ?? item.medicine_count
  ?? item.product_count
  ?? item.available
);

const PetCareBrands = ({ brands = [], onBrandPress }) => {
  const canLoop = brands.length > 1;
  const initialActiveIndex = canLoop ? 1 : 0;
  const loopedBrands = canLoop ? [...brands, ...brands, ...brands] : brands;
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const scrollRef = useRef(null);
  const initialScrollIndex = canLoop ? brands.length + initialActiveIndex : initialActiveIndex;
  const scrollX = useRef(new Animated.Value(initialScrollIndex * SNAP_INTERVAL)).current;

  useEffect(() => {
    const index = brands.length > 1 ? 1 : 0;
    const scrollIndex = brands.length > 1 ? brands.length + index : index;
    setActiveIndex(index);
    const frame = requestAnimationFrame(() => {
      scrollX.setValue(scrollIndex * SNAP_INTERVAL);
      scrollRef.current?.scrollTo({ x: scrollIndex * SNAP_INTERVAL, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [brands.length, scrollX]);

  const updateActiveIndex = event => {
    if (brands.length === 0) return;
    const offset = event.nativeEvent.contentOffset.x;
    const itemIndex = Math.round(offset / SNAP_INTERVAL);
    const nextIndex = canLoop
      ? ((itemIndex % brands.length) + brands.length) % brands.length
      : Math.max(0, Math.min(brands.length - 1, itemIndex));
    setActiveIndex(currentIndex => currentIndex === nextIndex ? currentIndex : nextIndex);
  };

  const handleScrollEnd = event => {
    updateActiveIndex(event);
    if (!canLoop) return;

    const offset = event.nativeEvent.contentOffset.x;
    const cycleWidth = brands.length * SNAP_INTERVAL;
    const middleCopyStart = cycleWidth;
    const middleCopyEnd = middleCopyStart + cycleWidth;
    if (offset < middleCopyStart || offset >= middleCopyEnd) {
      const relativeOffset = ((offset - middleCopyStart) % cycleWidth + cycleWidth) % cycleWidth;
      const normalizedOffset = middleCopyStart + relativeOffset;
      scrollX.setValue(normalizedOffset);
      scrollRef.current?.scrollTo({ x: normalizedOffset, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true, listener: updateActiveIndex },
        )}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {loopedBrands.map((item, index) => {
          const brandIndex = index % brands.length;
          const itemId = item.id || item.brand_id || brandIndex;
          const brandName = item.name || item.brand_name || '';
          const count = getAvailableCount(item);
          const isActive = brandIndex === activeIndex;
          const rotation = scrollX.interpolate({
            inputRange: [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ],
            outputRange: ['7deg', '0deg', '-7deg'],
            extrapolate: 'clamp',
          });
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ],
            outputRange: [0.97, 1, 0.97],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`${Math.floor(index / brands.length)}-${itemId}`}
              style={{ transform: [{ rotate: rotation }, { scale }] }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.brandCard, isActive ? styles.activeCard : styles.sideCard]}
                onPress={() => onBrandPress?.(item)}
              >
                {count !== undefined && count !== null && count !== '' && (
                  <View style={styles.availablePill}>
                    <Text style={styles.availableText}>
                      {typeof count === 'string' && /available/i.test(count) ? count : `${count} available`}
                    </Text>
                  </View>
                )}
                <Text style={styles.brandName} numberOfLines={2} adjustsFontSizeToFit>
                  {brandName}
                </Text>
                <View style={styles.arrowButton}>
                  <ArrowUpRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Keep enough viewport for the full card plus its bottom arrow button.
    height: CARD_HEIGHT + 40,
    paddingBottom: 18,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    gap: CARD_GAP,
    paddingTop: 8,
    paddingBottom: 8,
  },
  brandCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    overflow: 'visible',
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
  },
  sideCard: {
    backgroundColor: '#E2F0E5',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  brandName: {
    color: '#202020',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  availablePill: {
    position: 'absolute',
    top: 9,
    right: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F4F5F8',
  },
  availableText: {
    color: '#263077',
    fontSize: 10,
    fontWeight: '600',
  },
  arrowButton: {
    position: 'absolute',
    right: -8,
    bottom: -6,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#263077',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PetCareBrands;
