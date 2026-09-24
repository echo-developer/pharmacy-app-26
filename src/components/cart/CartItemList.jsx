import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartItemCard from './CartItemCard';

const items = [
  {
    id: 1,
    title: 'Cake world chocolate Toast Bake & Go lorem',
    pack: '1 Pack (1kg)',
    qty: 12,
    price: '456',
    cutPrice: '456',
    image: require('../../assets/images/deals.png'),
  },
  {
    id: 2,
    title: 'Cake world chocolate Toast Bake & Go lorem',
    pack: '1 Pack (1kg)',
    qty: 12,
    price: '456',
    cutPrice: '456',
    image: require('../../assets/images/Subtract.png'),
  },
  {
    id: 3,
    title: 'Cake world chocolate Toast Bake & Go lorem',
    pack: '1 Pack (1kg)',
    qty: 12,
    price: '456',
    cutPrice: '456',
    image: require('../../assets/images/deals.png'),
  },
];

const CartItemsList = ({ onQtyChange }) => {
  return (
    <View style={styles.wrapper}>
      {items.map((item, index) => (
        <CartItemCard
          key={item.id}
          item={item}
          showDashedBorder={index !== items.length - 1}
          onIncrease={() => onQtyChange?.(item.id, item.qty + 1)}
          onDecrease={() => onQtyChange?.(item.id, item.qty - 1)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CDDEE4',        
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
  },
});

export default CartItemsList;