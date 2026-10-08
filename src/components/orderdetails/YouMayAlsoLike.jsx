import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { ChevronRight, Star, Zap } from 'lucide-react-native';
import { isProductOutOfStock } from '../../utils/productAvailability';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/products.png'),
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/deals.png'),
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/Subtract.png'),
  },
];

const YouMayAlsoLike = ({ 
  onArrowPress, 
  onProductPress, 
  onAddPress,
  products = DEFAULT_PRODUCTS 
}) => {
  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>You may also like</Text>
          <Text style={styles.subtitle}>Buy now to get the best deals</Text>
        </View>

        <TouchableOpacity
          style={styles.arrowPill}
          onPress={onArrowPress}
          activeOpacity={0.85}
        >
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* ===== PRODUCT CARDS ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((item) => {
          const outOfStock = isProductOutOfStock(item);
          // Handle both object image URLs and require statements
          const imageSource = typeof item.image === 'string' 
            ? { uri: item.image } 
            : item.image;
          
          return (
            <TouchableOpacity
              key={item.id || item.product_id}
              activeOpacity={0.85}
              style={styles.card}
              onPress={() => onProductPress?.(item)}
            >
              {/* Image Area with Rating Pill */}
              <View style={styles.imageArea}>
                <Image
                  source={imageSource}
                  style={styles.image}
                  resizeMode="contain"
                />
                {item.rating && (
                  <View style={styles.ratingPill}>
                    <Star size={10} color="#FF8D28" fill="#FF8D28" />
                    <Text style={styles.ratingText}>
                      {item.rating} ({item.ratingCount || '0'})
                    </Text>
                  </View>
                )}
              </View>

              {/* Details */}
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title || item.product_name || 'Product Name'}
              </Text>
              <Text style={styles.tablets}>
                {item.tablets || item.unit || item.description || ''}
              </Text>
              {item.mrp && (
                <Text style={styles.mrp}>MRP ₹{item.mrp}</Text>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  ~₹{item.price || item.product_sell_price || item.sell_price || '0'}
                </Text>
                {item.discount && (
                  <Text style={styles.discount}>{item.discount}</Text>
                )}
              </View>

              <View style={styles.deliveryRow}>
                <Text style={styles.delivery}>
                  {item.delivery || 'Get in 30 mins'}
                </Text>
                <View style={styles.zapCircle}>
                  <Zap size={10} color="#043250" fill="#043250" />
                </View>
              </View>

              {/* ADD Button */}
              {outOfStock ? <View style={[styles.addButton, styles.unavailableButton]}><Text style={styles.unavailableText}>OUT OF STOCK</Text></View> : (
                <TouchableOpacity style={styles.addButton} onPress={() => onAddPress?.(item)} activeOpacity={0.85}>
                  <Text style={styles.addText}>ADD</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 12,
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

  /* ===== Cards ===== */
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
  stockBadge: { position: 'absolute', left: 4, right: 4, bottom: 4, alignItems: 'center', backgroundColor: 'rgba(38,48,119,0.88)', paddingVertical: 4, borderRadius: 5 },
  stockBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  ratingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0E1442',
    marginLeft: 3,
  },
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
  unavailableButton: { backgroundColor: '#F1F1F3' },
  unavailableText: { fontSize: 10, fontWeight: '800', color: '#777987', letterSpacing: 0.3 },
});

export default YouMayAlsoLike;
