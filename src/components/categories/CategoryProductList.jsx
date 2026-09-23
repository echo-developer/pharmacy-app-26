import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CategoryProductCard from './CategoryProductCard';

const products = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discountPct: '58%',
    delivery: 'Get in 30 mins',
    discount: '20% Off',
    image: require('../../assets/images/products.png'),
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discountPct: '58%',
    delivery: 'Get in 30 mins',
    discount: '20% Off',
    image: require('../../assets/images/deals.png'),
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discountPct: '58%',
    delivery: 'Get in 30 mins',
    discount: '20% Off',
    image: require('../../assets/images/Subtract.png'),
  },
];

const CategoryProductList = ({ onAddPress, onFavPress }) => {
  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {products.map((item) => (
        <CategoryProductCard
          key={item.id}
          product={item}
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