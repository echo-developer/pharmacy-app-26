import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Star, Minus, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;

const products = [
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
    initialQty: 0,
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
    initialQty: 12,
  },
];

const DealsProducts = ({ onAddPress, onQtyChange }) => {
  const [cart, setCart] = useState(
    products.reduce((acc, p) => ({ ...acc, [p.id]: p.initialQty }), {})
  );

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const newQty = Math.max(0, prev[id] + delta);
      onQtyChange?.(id, newQty);
      return { ...prev, [id]: newQty };
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {products.map((item) => {
        const qty = cart[item.id];
        return (
          <View key={item.id} style={styles.card}>
            {/* ===== IMAGE AREA ===== */}
            <View style={styles.imageArea}>
              <Image
                source={require('../../assets/images/deals.png')}
                style={styles.productImage}
                resizeMode="contain"
              />

              {/* Rating Pill */}
              <View style={styles.ratingPill}>
                <Star size={12} color="#FF8D28" fill="#FF8D28" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.ratingCount})
                </Text>
              </View>
            </View>

            {/* ===== DETAILS ===== */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.tablets}>{item.tablets}</Text>

            <Text style={styles.mrp}>MRP ₹{item.mrp}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>~₹{item.price}</Text>
              <Text style={styles.discount}>{item.discount}</Text>
            </View>

            <Text style={styles.delivery}>{item.delivery} ⚡</Text>

            {/* ===== BUTTON AREA ===== */}
            {qty === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  updateQty(item.id, 1);
                  onAddPress?.(item);
                }}
              >
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.id, -1)}
                >
                  <Minus size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{qty}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.id, 1)}
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