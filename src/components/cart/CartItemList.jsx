import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartItemCard from './CartItemCard';

const CartItemsList = ({ items = [], onQtyChange }) => {
  return (
    <View style={styles.wrapper}>
      {items.map((item, index) => (
        <CartItemCard
          key={item.product_id || item.id}
          item={{
            id: item.product_id || item.id,
            title: item.product_name || item.title,
            pack: item.unit || item.pack,
            qty: item.cartqty || item.qty,
            price: item.price || item.product_sell_price,
            cutPrice: item.mrp || item.product_mrp,
            image: item.image,
          }}
          showDashedBorder={index !== items.length - 1}
          onIncrease={() => onQtyChange?.(item.product_id || item.id, (item.cartqty || item.qty) + 1)}
          onDecrease={() => onQtyChange?.(item.product_id || item.id, (item.cartqty || item.qty) - 1)}
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