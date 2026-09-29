import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Minus, Plus } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonService from '../../utils/CommonService';

const ProductBottomBar = ({
  message = 'yay! you have unlocked',
  highlight = 'EXTRA 10% OFF',
  suffix = 'on this product',
  product,
  onAddToCart,
  onBuyNow,
}) => {
  const cart = useSelector(state => state.GlobalReducer.cart);

  // Derive cartQty from redux cart so it re-renders on change
  const cartQty = React.useMemo(() => {
    if (!cart || !cart.items || !product?.product_id) return 0;
    const item = cart.items.find(
      o => Math.abs(o.product_id) === Math.abs(product.product_id),
    );
    return item ? item.cartqty : 0;
  }, [cart, product?.product_id]);

  const handleIncrease = () => {
    if (product) CommonService.addToCart(product);
  };

  const handleDecrease = () => {
    if (product) CommonService.decreaseCart(product.product_id);
  };

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
        {/* Add to Cart / Stepper */}
        {cartQty > 0 ? (
          <View style={styles.stepperBtn}>
            <TouchableOpacity
              style={styles.stepperCircle}
              activeOpacity={0.8}
              onPress={handleDecrease}
            >
              <Minus size={16} color="#263077" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.stepperQty}>{cartQty}</Text>
            <TouchableOpacity
              style={styles.stepperCircle}
              activeOpacity={0.8}
              onPress={handleIncrease}
            >
              <Plus size={16} color="#263077" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartBtn}
            activeOpacity={0.85}
            onPress={onAddToCart}
          >
            <ShoppingCart size={18} color="#263077" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}

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
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* ===== Top Strip ===== */
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6E6E56',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexWrap: 'wrap',
  },
  stripText: {
    fontSize: 12,
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    borderColor: '#CACCDA',
    borderRadius: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263077',
  },

  /* ===== Stepper ===== */
  stepperBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#263077',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  stepperCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263077',
    minWidth: 28,
    textAlign: 'center',
  },

  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263077',
    borderRadius: 24,
    paddingVertical: 12,
    gap: 6,
  },
  buyNowText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default ProductBottomBar;
