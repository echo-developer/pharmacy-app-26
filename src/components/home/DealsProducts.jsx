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
import { Star, Minus, Plus } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;

const DealsProducts = ({ products = [], onAddPress, onProductPress }) => {
  const cartItems = useSelector(state => state.GlobalReducer.cart?.items || []);
  const getCartQty = id => cartItems.find(item => Math.abs(item.product_id) === Math.abs(id))?.cartqty || 0;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {products.map((item, index) => {
        const itemId = item.product_id || item.id || index;
        const qty = getCartQty(itemId);
        const outOfStock = isProductOutOfStock(item);
        // Support both API field names and legacy field names
        const title = item.product_name || item.title;
        const mrp = item.product_mrp || item.mrp;
        const price = item.product_sell_price || item.price;
        const unit = item.unit || item.tablets;
        const rating = item.product_rating || item.rating || 0;
        const ratingCount = item.product_total_rating || item.ratingCount || 0;
        const discount = item.discount || '';
        const delivery = item.delivery || '';
        const imageUri = typeof item.image === 'string' ? item.image : '';
        return (
          <View key={itemId.toString()} style={styles.card}>
            {/* ===== IMAGE AREA ===== */}
            <TouchableOpacity
              style={styles.imageArea}
              activeOpacity={onProductPress ? 0.85 : 1}
              onPress={() => onProductPress?.(item)}
              disabled={!onProductPress}
              accessibilityRole={onProductPress ? 'button' : undefined}
              accessibilityLabel={onProductPress ? `View ${title}` : undefined}
            >
              <Image
                source={
                  imageUri && !imageUri.includes('via.placeholder')
                    ? { uri: imageUri }
                    : require('../../assets/images/deals.png')
                }
                style={styles.productImage}
                resizeMode="contain"
              />
              {/* Rating Pill */}
              {(rating > 0 || ratingCount > 0) && (
                <View style={styles.ratingPill}>
                  <Star size={12} color="#FF8D28" fill="#FF8D28" />
                  <Text style={styles.ratingText}>
                    {rating} ({ratingCount})
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* ===== DETAILS ===== */}
            <TouchableOpacity
              onPress={() => onProductPress?.(item)}
              disabled={!onProductPress}
              activeOpacity={onProductPress ? 0.85 : 1}
              accessibilityRole={onProductPress ? 'button' : undefined}
            >
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </TouchableOpacity>

            {unit ? <Text style={styles.tablets}>{unit}</Text> : null}

            {mrp ? <Text style={styles.mrp}>MRP ₹{mrp}</Text> : null}

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{price}</Text>
              {discount ? <Text style={styles.discount}>{discount}</Text> : null}
            </View>

            {delivery ? <Text style={styles.delivery}>{delivery} ⚡</Text> : null}

            {/* ===== BUTTON AREA ===== */}
            {outOfStock ? (
              <View style={[styles.addButton, styles.unavailableButton]}>
                <Text style={styles.unavailableText}>OUT OF STOCK</Text>
              </View>
            ) : qty === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (onAddPress) onAddPress(item);
                  else CommonService.addToCart(item);
                }}
              >
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    CommonService.decreaseCart(itemId);
                  }}
                >
                  <Minus size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{qty}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    CommonService.addToCart(item);
                  }}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 3,
  },

  /* ===== IMAGE AREA ===== */
  imageArea: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  ratingPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0E1442',
    marginLeft: 3,
  },

  /* ===== DETAILS ===== */
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#043250',
    lineHeight: 17,
  },
  tablets: {
    fontSize: 11,
    color: '#787887',
    marginTop: 4,
  },
  mrp: {
    fontSize: 11,
    color: '#949494',
    textDecorationLine: 'line-through',
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E1442',
  },
  discount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6565',
    marginLeft: 6,
  },
  delivery: {
    fontSize: 11,
    color: '#787887',
    marginTop: 4,
    marginBottom: 10,
  },

  /* ===== ADD BUTTON ===== */
  addButton: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  addText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263077',
    letterSpacing: 0.5,
  },
  stockBadge: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(27, 34, 50, 0.82)',
    borderRadius: 6,
    paddingVertical: 4,
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  unavailableButton: {
    backgroundColor: '#F1F2F4',
    borderColor: '#E1E3E6',
  },
  unavailableText: {
    color: '#777C85',
    fontSize: 11,
    fontWeight: '800',
  },

  /* ===== QUANTITY SELECTOR ===== */
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2CB7DF',
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 12,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DealsProducts;
