import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBag, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import store from '../../store/store';

const CartFloatingBar = () => {
  const navigation = useNavigation();
  const [cartState, setCartState] = useState(store.getState().GlobalReducer.cart);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCartState(store.getState().GlobalReducer.cart);
    });
    return () => unsubscribe();
  }, []);

  const items = cartState?.items || [];
  if (items.length === 0) return null;

  const totalQty = items.reduce((sum, item) => sum + (item.cartqty || 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + (Math.abs(item.price || item.product_sell_price || 0) * (item.cartqty || 1)), 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bar}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Cart')}
      >
        <View style={styles.leftCol}>
          <View style={styles.iconWrapper}>
            <ShoppingBag size={20} color="#FFFFFF" />
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyBadgeText}>{totalQty}</Text>
            </View>
          </View>
          <View style={styles.textCol}>
            <Text style={styles.itemCountText}>{totalQty} {totalQty === 1 ? 'Item' : 'Items'} added</Text>
            <Text style={styles.priceText}>₹{totalPrice}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bar: {
    backgroundColor: '#0D7998',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  qtyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#709D2A',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  qtyBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  textCol: {
    justifyContent: 'center',
  },
  itemCountText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
});

export default CartFloatingBar;
