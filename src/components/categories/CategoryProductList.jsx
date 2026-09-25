import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CategoryProductCard from './CategoryProductCard';

const CategoryProductList = ({ products = [], onAddPress, onFavPress }) => {
  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {products.map((item) => (
        <CategoryProductCard
          key={item.product_id || item.id}
          product={{
            id: item.product_id || item.id,
            title: item.product_name || item.title,
            tablets: item.unit || item.tablets,
            mrp: item.mrp || item.product_mrp,
            price: item.price || item.product_sell_price,
            discountPct: item.discount || item.discountPct,
            delivery: item.delivery || 'Get in 30 mins',
            discount: item.discount || '20% Off',
            image: item.image,
          }}
          onAddPress={() => onAddPress?.(item)}
          onFavPress={() => onFavPress?.(item)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#F4F5FF',       // List background
  },
  content: {
    padding: 12,
  },
});

export default CategoryProductList;