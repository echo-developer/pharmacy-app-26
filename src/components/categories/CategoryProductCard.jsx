import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const CategoryProductCard = ({ product, onAddPress, onFavPress }) => {
  return (
    <View style={styles.card}>
      {/* ===== TOP: Image + Details ===== */}
      <View style={styles.topRow}>
        {/* Image Area */}
        <View style={styles.imageArea}>
          {product.discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.discount}</Text>
            </View>
          )}
          <Image
            source={
              product.image && typeof product.image === 'string'
                ? { uri: product.image }
                : product.image || require('../../assets/images/products.png')
            }
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          <Text style={styles.tablets}>{product.tablets}</Text>

          <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>~₹{product.price}</Text>
            <Text style={styles.discountPct}>{product.discountPct}</Text>
          </View>

          <View style={styles.deliveryRow}>
            <Text style={styles.delivery}>{product.delivery}</Text>
            {/* Gradient Zap Icon */}
            <LinearGradient
              colors={['#E8F4FA', '#A2D0E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zapCircle}
            >
              <Zap size={10} color="#043250" fill="#043250" />
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* ===== BOTTOM: Heart + ADD ===== */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.iconBox} onPress={onFavPress}>
          <Heart size={18} color="#263077" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF3F5',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== Top Row ===== */
  topRow: {
    flexDirection: 'row',
  },
  imageArea: {
    width: 110,
    height: 110,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },

  /* ===== Details ===== */
  details: {
    flex: 1,
    justifyContent: 'flex-start',
  },
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
  discountPct: {
    fontSize: 12,
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
    fontSize: 11,
    color: '#787887',
    marginRight: 6,
  },
  zapCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== Bottom Row ===== */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    letterSpacing: 0.5,
  },
});

export default CategoryProductCard;