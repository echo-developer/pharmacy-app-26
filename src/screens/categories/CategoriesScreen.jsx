import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Modal, TouchableOpacity, ScrollView, Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategoriesSidebar from '../../components/categories/CategoriesSidebar';
import SubcategorySelector from '../../components/categories/SubcategorySelector';
import FilterSortBar from '../../components/categories/FilterSortBar';
import CategoryProductList from '../../components/categories/CategoryProductList';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';
import store from '../../store/store';
import CartFloatingBar from '../../components/cart/CartFloatingBar';
import { X } from 'lucide-react-native';

const CategoriesScreen = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isInStockOnly, setIsInStockOnly] = useState(false);

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
            setActiveSubcategory(null);
            getProductsApi(firstCatId, selectedSort, selectedDiscount, priceRange);
          } else {
            getProductsApi(null, selectedSort, selectedDiscount, priceRange);
          }
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('Categories API Error:', error);
      });
  };

  // Load products filtered by category and sort options
  const getProductsApi = (
    categoryId = activeCategory,
    sort = selectedSort,
    discount = selectedDiscount,
    range = priceRange,
    subcategoryId = activeSubcategory,
  ) => {
    const urlParams = {
      category_id: categoryId || '',
      sort_by: sort,
      min_discount: discount > 0 ? discount : '',
      min: range.min > 0 ? range.min : '',
      max: range.max > 0 ? range.max : '',
    };
    // Omitting sub_category_id means "Shop all" within the selected parent category.
    if (subcategoryId != null && subcategoryId !== '') {
      urlParams.sub_category_id = subcategoryId;
    }
    setProductsLoading(true);
    CommonService._callApi({
      api: 'product/list',
      method: 'GET',
      urlParams,
    })
      .then(resp => {
        if (resp.data?.status == 1) {
          setProducts(resp.data.response.data || []);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        setProducts([]);
        console.log('Products API Error:', error);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    getProductsApi(categoryId, selectedSort, selectedDiscount, priceRange, null);
  };

  const handleSubcategoryPress = (subcategory) => {
    const subcategoryId = subcategory.sub_category_id || subcategory.category_id || subcategory.id;
    setActiveSubcategory(subcategoryId);
    getProductsApi(activeCategory, selectedSort, selectedDiscount, priceRange, subcategoryId);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleSortPress = () => {
    setSortModalVisible(true);
  };

  const handleInStockToggle = () => {
    setIsInStockOnly(prev => !prev);
  };

  const applyFilter = () => {
    setFilterModalVisible(false);
    getProductsApi(activeCategory, selectedSort, selectedDiscount, priceRange);
  };

  const resetFilter = () => {
    setSelectedDiscount(0);
    setPriceRange({ min: 0, max: 0 });
    setFilterModalVisible(false);
    getProductsApi(activeCategory, selectedSort, 0, { min: 0, max: 0 });
  };

  const applySort = (sortOption) => {
    setSelectedSort(sortOption);
    setSortModalVisible(false);
    getProductsApi(activeCategory, sortOption, selectedDiscount, priceRange);
  };

  // Process products list based on in-stock toggle and client sorting fallback
  const getProcessedProducts = () => {
    let result = [...products];

    // Filter in stock if enabled
    if (isInStockOnly) {
      result = result.filter(p => !isProductOutOfStock(p));
    }

    // Client-side sort fallback if API doesn't re-order
    if (selectedSort === 'price_asc') {
      result.sort((a, b) => (parseFloat(a.product_sell_price || a.price || 0) - parseFloat(b.product_sell_price || b.price || 0)));
    } else if (selectedSort === 'price_desc') {
      result.sort((a, b) => (parseFloat(b.product_sell_price || b.price || 0) - parseFloat(a.product_sell_price || a.price || 0)));
    } else if (selectedSort === 'name_asc') {
      result.sort((a, b) => (a.product_name || a.title || '').localeCompare(b.product_name || b.title || ''));
    } else if (selectedSort === 'name_desc') {
      result.sort((a, b) => (b.product_name || b.title || '').localeCompare(a.product_name || a.title || ''));
    }

    return result;
  };

  const SORT_OPTIONS = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A to Z', value: 'name_asc' },
    { label: 'Name: Z to A', value: 'name_desc' },
  ];

  const DISCOUNT_OPTIONS = [
    { label: 'No discount filter', value: 0 },
    { label: 'Any discount', value: -1 },
    { label: '10% off or more', value: 10 },
    { label: '20% off or more', value: 20 },
    { label: '25% off or more', value: 25 },
    { label: '50% off or more', value: 50 },
  ];

  const handleFavPress = (item) => {
    const authuser = store.getState().GlobalReducer.authuser;
    if (!authuser) {
      navigation.navigate('Login');
      return;
    }
    const pid = item.product_id || item.id;
    const currentFav =
      store.getState().GlobalReducer.favoriteOverrides[Math.abs(pid)] !== undefined
        ? store.getState().GlobalReducer.favoriteOverrides[Math.abs(pid)] === 1
        : item.is_favorite === 1;

    // Optimistic update
    store.dispatch({
      type: 'SET_FAVORITE_STATUS',
      payload: { product_id: pid, is_favorite: !currentFav },
    });

    const inputparams = new FormData();
    inputparams.append('product_id', pid);
    CommonService._callApi({
      api: '/member/favorite',
      method: 'CONVERT',
      body: inputparams,
    })
      .then(r => r.json())
      .then(response => {
        if (response.status == 1) {
          // Use API response value directly
          const newIsFav = response.response?.data?.is_favorite === 1;
          store.dispatch({
            type: 'SET_FAVORITE_STATUS',
            payload: { product_id: pid, is_favorite: newIsFav },
          });
        } else {
          // Revert on failure
          store.dispatch({
            type: 'SET_FAVORITE_STATUS',
            payload: { product_id: pid, is_favorite: currentFav },
          });
        }
      })
      .catch(() => {
        store.dispatch({
          type: 'SET_FAVORITE_STATUS',
          payload: { product_id: pid, is_favorite: currentFav },
        });
      });
  };

  useEffect(() => {
    getCategoriesApi();
  }, []);

  const cart = useSelector(state => state.GlobalReducer.cart);
  const cartCount = cart?.items?.length || 0;
  const activeCategoryData = categories.find(category =>
    String(category.category_id || category.id) === String(activeCategory),
  );
  const activeSubcategories = Array.isArray(activeCategoryData?.subcategories)
    ? activeCategoryData.subcategories
    : [];

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
                onFilterPress={handleFilterPress}
                onSortPress={handleSortPress}
                currentSort={selectedSort}
                isInStockOnly={isInStockOnly}
                onInStockToggle={handleInStockToggle}
                hasActiveFilters={selectedDiscount > 0 || priceRange.min > 0 || priceRange.max > 0}
              />
              <SubcategorySelector
                categoryName={activeCategoryData?.category_name || activeCategoryData?.name}
                subcategories={activeSubcategories}
                selectedSubcategoryId={activeSubcategory}
                isShopAllSelected={!activeSubcategory}
                onSubcategoryPress={handleSubcategoryPress}
                onShopAllPress={() => {
                  setActiveSubcategory(null);
                  getProductsApi(activeCategory, selectedSort, selectedDiscount, priceRange, null);
                }}
              />
              <CategoryProductList
                products={getProcessedProducts()}
                loading={productsLoading}
                onProductPress={(item) => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
                onAddPress={(item) => CommonService.addToCart(item)}
                onFavPress={handleFavPress}
              />
            </View>
          </View>
        </>
      )}
      <CartFloatingBar />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Discount</Text>
              {DISCOUNT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    selectedDiscount === option.value && styles.optionRowActive,
                  ]}
                  onPress={() => setSelectedDiscount(option.value)}
                >
                  <View style={[
                    styles.radioCircle,
                    selectedDiscount === option.value && styles.radioCircleActive
                  ]}>
                    {selectedDiscount === option.value && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedDiscount === option.value && styles.optionTextActive
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Min ₹</Text>
                  <TextInput
                    style={styles.priceTextInput}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                    value={priceRange.min ? String(priceRange.min) : ''}
                    onChangeText={(val) => setPriceRange({ ...priceRange, min: parseInt(val) || 0 })}
                  />
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Max ₹</Text>
                  <TextInput
                    style={styles.priceTextInput}
                    keyboardType="numeric"
                    placeholder="Any"
                    placeholderTextColor="#999"
                    value={priceRange.max ? String(priceRange.max) : ''}
                    onChangeText={(val) => setPriceRange({ ...priceRange, max: parseInt(val) || 0 })}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilter}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    selectedSort === option.value && styles.optionRowActive,
                  ]}
                  onPress={() => applySort(option.value)}
                >
                  <View style={[
                    styles.radioCircle,
                    selectedSort === option.value && styles.radioCircleActive
                  ]}>
                    {selectedSort === option.value && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedSort === option.value && styles.optionTextActive
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    marginBottom: 12,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  optionRowActive: {
    backgroundColor: 'rgba(44, 183, 223, 0.05)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D5D5D5',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#2CB7DF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2CB7DF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    color: '#2CB7DF',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  priceLabel: {
    fontSize: 14,
    color: '#787887',
    marginRight: 6,
  },
  priceTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#043250',
    fontWeight: '600',
    paddingVertical: 6,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F4F5FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#2CB7DF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CategoriesScreen;
