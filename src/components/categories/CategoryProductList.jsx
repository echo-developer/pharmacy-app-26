import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CategoryProductCard from './CategoryProductCard';

const CategoryProductList = ({ products = [], onProductPress, onAddPress, onFavPress, favoriteIds = {} }) => {
  // Read favoriteOverrides from redux so heart state syncs across screens
  const favoriteOverrides = useSelector(state => state.GlobalReducer.favoriteOverrides);

  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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
});

export default CategoryProductList;
