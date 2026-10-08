import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CategoryProductCard from './CategoryProductCard';
import { isProductOutOfStock } from '../../utils/productAvailability';

const CategoryProductList = ({ products = [], loading = false, onProductPress, onAddPress, onFavPress, favoriteIds = {} }) => {
  // Read favoriteOverrides from redux so heart state syncs across screens
  const favoriteOverrides = useSelector(state => state.GlobalReducer.favoriteOverrides);

  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {loading && products.length === 0 ? (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="small" color="#0D7998" />
        </View>
      ) : !loading && products.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyText}>No products found in this category.</Text>
        </View>
      ) : null}
      {products.map((item) => {
        const pid = Math.abs(item.product_id || item.id);
        // Check redux override first, fallback to API-supplied is_favorite
        const isFav =
          favoriteOverrides[pid] !== undefined
            ? favoriteOverrides[pid] === 1
            : item.is_favorite === 1;

        return (
          <CategoryProductCard
            key={item.product_id || item.id}
            product={{
              ...item,
              id: item.product_id || item.id,
              title: item.product_name || item.title,
              tablets: item.unit || item.tablets,
              mrp: item.mrp || item.product_mrp,
              price: item.price || item.product_sell_price,
              discountPct: item.discount || item.discountPct,
              delivery: item.delivery || 'Get in 30 mins',
              discount: item.discount || '20% Off',
              image: item.image,
              isOutOfStock: isProductOutOfStock(item),
            }}
            isFavorite={isFav}
            onProductPress={() => onProductPress?.(item)}
            onAddPress={() => onAddPress?.(item)}
            onFavPress={() => onFavPress?.(item)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#F4F5FF',
  },
  content: {
    padding: 12,
  },
  messageContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#787887',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default CategoryProductList;
