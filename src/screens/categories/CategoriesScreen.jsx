import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategoriesSidebar from '../../components/categories/CategoriesSidebar';
import FilterSortBar from '../../components/categories/FilterSortBar';
import CategoryProductList from '../../components/categories/CategoryProductList';

const CategoriesScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <CategoryHeader
        title="Pet Supplements"
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => navigation.navigate('ProductDetails')}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <View style={styles.body}>
        <CategoriesSidebar
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />
        <View style={styles.contentArea}>
          <FilterSortBar
            onFilterPress={() => console.log('Filter pressed')}
            onSortPress={() => console.log('Sort pressed')}
          />
          <CategoryProductList
            onAddPress={(item) => console.log('Add:', item.title)}
            onFavPress={(item) => console.log('Fav:', item.title)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5FF' },
  body: { flex: 1, flexDirection: 'row' },
  contentArea: { flex: 1, backgroundColor: '#F4F5FF' },
});

export default CategoriesScreen;