import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
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
  const initialActiveIndex = brands.length > 1 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const scrollRef = useRef(null);

  useEffect(() => {
    const index = brands.length > 1 ? 1 : 0;
    setActiveIndex(index);
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: index * SNAP_INTERVAL, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [brands.length]);

  const handleScrollEnd = event => {
    const offset = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.max(0, Math.min(brands.length - 1, Math.round(offset / SNAP_INTERVAL))));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((item, index) => {
          const itemId = item.id || item.brand_id || index;
          const brandName = item.name || item.brand_name || '';
          const count = getAvailableCount(item);
          const isActive = index === activeIndex;
          const rotation = index < activeIndex ? '-5deg' : '5deg';

          return (
            <TouchableOpacity
              key={itemId.toString()}
              activeOpacity={0.9}
              style={[
                styles.brandCard,
                isActive ? styles.activeCard : styles.sideCard,
                !isActive && { transform: [{ rotate: rotation }] },
              ]}
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
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT + 22,
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
