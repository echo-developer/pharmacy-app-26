import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ChevronRight, Star, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

const RelatedProducts = ({ products = [], onArrowPress, onProductPress, onAddPress }) => {
  // Don't render section if no products
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Related Products</Text>
          <Text style={styles.subtitle}>Buy now to get the best deals</Text>
        </View>

        <TouchableOpacity
          style={styles.arrowPill}
          onPress={onArrowPress}
          activeOpacity={0.85}>
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* ===== PRODUCT CARDS ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {products.map((item, index) => {
          const hasDiscount =
            item.product_mrp && item.product_sell_price &&
            item.product_mrp > item.product_sell_price;
          const discountPct = hasDiscount
            ? Math.round(
              ((item.product_mrp - item.product_sell_price) / item.product_mrp) * 100,
            )
            : null;

          const avgRating =
            item.rating && item.rating.length > 0
              ? (
                item.rating.reduce(
                  (a, b) => a + parseFloat(b.rating_value || 0),
                  0,
                ) / item.rating.length
              ).toFixed(1)
              : null;

          return (
            <TouchableOpacity
              key={item.product_id ?? index}
              activeOpacity={0.85}
              style={styles.card}
              onPress={() => onProductPress?.(item)}>
              {/* Image Area with Rating Pill */}
              <View style={styles.imageArea}>
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require('../../assets/images/deals.png')
                  }
                  style={styles.image}
                  resizeMode="contain"
                />
                {avgRating && (
                  <View style={styles.ratingPill}>
                    <Star size={10} color="#FF8D28" fill="#FF8D28" />
                    <Text style={styles.ratingText}>
                      {avgRating} ({item.rating.length})
                    </Text>
                  </View>
                )}
              </View>

              {/* Details */}
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.product_name}
              </Text>
              {item.unit ? (
                <Text style={styles.tablets}>{item.unit}</Text>
              ) : null}
              {hasDiscount ? (
                <Text style={styles.mrp}>MRP ₹{item.product_mrp}</Text>
              ) : null}

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.product_sell_price}</Text>
                {discountPct ? (
                  <Text style={styles.discount}>{discountPct}%</Text>
                ) : null}
              </View>

              <View style={styles.deliveryRow}>
                <Text style={styles.delivery}>Get in 30 mins</Text>
                <View style={styles.zapCircle}>
                  <Zap size={10} color="#043250" fill="#043250" />
                </View>
              </View>

              {/* ADD Button */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddPress?.(item)}
                activeOpacity={0.85}>
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#043250',
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',
    marginTop: 4,
  },
  arrowPill: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0F848B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== Scroll Cards ===== */
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  /* Image Area */
  imageArea: {
    width: '100%',
    height: 110,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  ratingPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0E1442',
    marginLeft: 3,
  },

  /* Details */
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#043250',
    lineHeight: 16,
  },
  tablets: {
    fontSize: 10,
    color: '#787887',
    marginTop: 4,
  },
  mrp: {
    fontSize: 10,
    color: '#949494',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E1442',
  },
  discount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6565',
    marginLeft: 6,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  delivery: {
    fontSize: 10,
    color: '#787887',
    marginRight: 4,
  },
  zapCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E8F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ADD Button */
  addButton: {
    marginTop: 10,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#263077',
    letterSpacing: 0.5,
  },
});

export default RelatedProducts;
