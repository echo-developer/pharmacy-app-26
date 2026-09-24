import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProductBottomBar = ({
  message = 'yay! you have unlocked',
  highlight = 'EXTRA 10% OFF',
  suffix = 'on this product',
  onAddToCart,
  onBuyNow,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== TOP STRIP ===== */}
      <View style={styles.strip}>
        <Text style={styles.stripText}>{message} </Text>

        <LinearGradient
          colors={['#969665', '#6E6E56']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.highlightPill}
        >
          <Text style={styles.highlightText}>{highlight}</Text>
        </LinearGradient>

        <Text style={styles.stripText}> {suffix}</Text>
      </View>

      {/* ===== BUTTONS ROW ===== */}
      <View style={styles.buttonRow}>
        {/* Add to Cart */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.85}
          onPress={onAddToCart}
        >
          <ShoppingCart size={18} color="#263077" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Buy Now */}
        <TouchableOpacity
          style={styles.buyNowBtn}
          activeOpacity={0.85}
          onPress={onBuyNow}
        >
          <ShoppingCart size={18} color="#FFFFFF" />
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* ===== Top Strip ===== */
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6E6E56',         // Strip bg
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexWrap: 'wrap',
  },
  stripText: {
    fontSize: 12,
    color: '#FFFFFF',                  // Strip text
    fontWeight: '500',
  },
  highlightPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',                  // Highlight text
    letterSpacing: 0.3,
  },

  /* ===== Buttons ===== */
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 10,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CACCDA',            // Border
    borderRadius: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263077',                  // Add to Cart text
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263077',        // Buy Now bg
    borderRadius: 24,
    paddingVertical: 12,
    gap: 6,
  },
  buyNowText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',                  // Buy Now text
  },
});

export default ProductBottomBar;