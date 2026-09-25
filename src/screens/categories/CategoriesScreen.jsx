import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategoriesSidebar from '../../components/categories/CategoriesSidebar';
import FilterSortBar from '../../components/categories/FilterSortBar';
import CategoryProductList from '../../components/categories/CategoryProductList';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const CategoriesScreen = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // Load categories list
  const getCategoriesApi = () => {
    setLoader(true);
    CommonService._callApi({
      api: 'home/category',
      method: 'GET',
      urlParams: {},
    })
      .then(resp => {
        setLoader(false);
        if (resp.data?.status == 1) {
          const cats = resp.data.response.data || [];
          setCategories(cats);
          // Load products for first category by default
          if (cats.length > 0) {
            const firstCatId = cats[0].category_id;
            setActiveCategory(firstCatId);
            getProductsApi(firstCatId);
          } else {
            getProductsApi(null);
          }
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('Categories API Error:', error);
      });
  };

  // Load products filtered by category
  const getProductsApi = (categoryId) => {
    const urlParams = categoryId ? { category_id: categoryId } : {};
    CommonService._callApi({
      api: 'product/list',
      method: 'GET',
      urlParams,
    })
      .then(resp => {
        if (resp.data?.status == 1) {
          setProducts(resp.data.response.data || []);
        }
      })
      .catch(error => {
        console.log('Products API Error:', error);
      });
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    getProductsApi(categoryId);
  };

  useEffect(() => {
    getCategoriesApi();
  }, []);

  const cart = store.getState().GlobalReducer.cart;
  const cartCount = cart?.items?.length || 0;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <>
          <CategoryHeader
            title="Categories"
            cartCount={cartCount}
            onBackPress={() => navigation.goBack()}
            onSearchPress={() => navigation.navigate('Search')}
            onCartPress={() => navigation.navigate('Cart')}
          />

          <View style={styles.body}>
            <CategoriesSidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryPress={handleCategoryPress}
            />
            <View style={styles.contentArea}>
              <FilterSortBar
                onFilterPress={() => console.log('Filter pressed')}
                onSortPress={() => console.log('Sort pressed')}
              />
              <CategoryProductList
                products={products}
                onProductPress={(item) => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
                onAddPress={(item) => CommonService.addToCart(item)}
                onFavPress={(item) => console.log('Fav:', item.product_name)}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5FF' },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, flexDirection: 'row' },
  contentArea: { flex: 1, backgroundColor: '#F4F5FF' },
});

export default CategoriesScreen;