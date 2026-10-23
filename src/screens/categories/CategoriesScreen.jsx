import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Modal, TouchableOpacity, ScrollView, Text, TextInput, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryHeader from '../../components/categories/CategoryHeader';
import FilterSortBar from '../../components/categories/FilterSortBar';
import CategoryProductList from '../../components/categories/CategoryProductList';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';
import store from '../../store/store';
import CartFloatingBar from '../../components/cart/CartFloatingBar';
import { CachedImage as Image } from '../../components/common/CachedImage';
import { ChevronRight, X } from 'lucide-react-native';
import { CategoriesLoadingSkeleton } from '../../components/common/ScreenLoadingSkeletons';
import LinearGradient from 'react-native-linear-gradient';
import CategoryItem from '../../components/categories/CategoryItem';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SUBCATEGORY_TILE_WIDTH = (SCREEN_WIDTH - 32 - 20) / 3;

const CategoriesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const productCache = useRef(new Map());
  const productRequestId = useRef(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [showCategoryProducts, setShowCategoryProducts] = useState(false);
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
    const cacheKey = JSON.stringify({
      categoryId: categoryId || '',
      subcategoryId: subcategoryId || '',
      sort,
      discount,
      min: range.min,
      max: range.max,
    });
    const cachedProducts = productCache.current.get(cacheKey);
    const requestId = ++productRequestId.current;
    if (cachedProducts) {
      setProducts(cachedProducts);
    } else {
      // Never leave the previous category visible while the next list loads.
      setProducts([]);
    }
    setProductsLoading(!cachedProducts);
    CommonService._callApi({
      api: 'product/list',
      method: 'GET',
      urlParams,
    })
      .then(resp => {
        if (resp.data?.status == 1) {
          const nextProducts = resp.data.response.data || [];
          productCache.current.set(cacheKey, nextProducts);
          if (requestId === productRequestId.current) setProducts(nextProducts);
        } else {
          if (requestId === productRequestId.current && !cachedProducts) setProducts([]);
        }
      })
      .catch(error => {
        if (requestId === productRequestId.current && !cachedProducts) setProducts([]);
        console.log('Products API Error:', error);
      })
      .finally(() => {
        if (requestId === productRequestId.current) setProductsLoading(false);
      });
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    getProductsApi(categoryId, selectedSort, selectedDiscount, priceRange, null);
    setShowCategoryProducts(true);
  };

  const selectLandingCategory = categoryId => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  };

  const openSubcategory = (category, subcategory) => {
    const categoryId = category.category_id || category.id;
    const subcategoryId = subcategory.sub_category_id || subcategory.category_id || subcategory.id;
    setActiveCategory(categoryId);
    setActiveSubcategory(subcategoryId);
    getProductsApi(categoryId, selectedSort, selectedDiscount, priceRange, subcategoryId);
    setShowCategoryProducts(true);
  };

  const returnToCategories = () => {
    setShowCategoryProducts(false);
    setActiveSubcategory(null);
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
  const categorySections = categories.map(category => ({
    ...category,
    _id: category.category_id || category.id,
    _name: category.category_name || category.name || category.label || 'Category',
    _subcategories: Array.isArray(category.subcategories)
      ? category.subcategories
      : Array.isArray(category.sub_categories)
        ? category.sub_categories
        : Array.isArray(category.children)
          ? category.children
          : Array.isArray(category.items)
            ? category.items
            : [],
  }));

  const getSubcategoryImage = item => {
    const featuredProduct = item.products?.[0] || item.items?.[0] || item.product || {};
    const image = item.image || item.sub_category_image || item.category_image ||
      featuredProduct.image || featuredProduct.product_image;
    return typeof image === 'string' && image ? { uri: image } : image;
  };

  const getDiscountLabel = item => {
    const featuredProduct = item.products?.[0] || item.items?.[0] || item.product || item;
    const rawDiscount = item.discount_text || item.discount || featuredProduct.discount_text || featuredProduct.discount;
    if (rawDiscount) {
      const discount = String(rawDiscount);
      return /^up\s+to/i.test(discount) ? discount : `Up to ${discount}`;
    }
    const mrp = Number(featuredProduct.product_mrp || featuredProduct.mrp);
    const price = Number(featuredProduct.product_sell_price || featuredProduct.sell_price || featuredProduct.price);
    if (mrp > 0 && price >= 0 && price < mrp) {
      return `Up to ${Math.round(((mrp - price) / mrp) * 100)}% off`;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {loader ? (
        <CategoriesLoadingSkeleton />
      ) : (
        <>
          {showCategoryProducts ? (
            <>
              <CategoryHeader
                title={activeCategoryData?.category_name || activeCategoryData?.name || 'Categories'}
                cartCount={cartCount}
                onBackPress={returnToCategories}
                onSearchPress={() => navigation.navigate('Search')}
                onCartPress={() => navigation.navigate('Cart')}
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
              <CategoryProductList
                products={getProcessedProducts()}
                loading={productsLoading}
                onProductPress={(item) => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
                onAddPress={(item) => CommonService.addToCart(item)}
                onFavPress={handleFavPress}
              />
            </View>
            </>
          ) : (
            <LinearGradient colors={['#F4F5FF', '#FFFFFF']} style={styles.landingBackground}>
              <CategoryHeader
                title="Category"
                cartCount={cartCount}
                onBackPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
                onSearchPress={() => navigation.navigate('Search')}
                onCartPress={() => navigation.navigate('Cart')}
              />
              <View style={styles.categoryBrowser}>
                <ScrollView style={styles.categorySidebar} contentContainerStyle={styles.categorySidebarContent} showsVerticalScrollIndicator={false}>
                  {categorySections.map(category => (
                    <CategoryItem
                      key={String(category._id)}
                      label={category._name}
                      image={category.image || category.category_image}
                      isActive={String(activeCategory) === String(category._id)}
                      onPress={() => selectLandingCategory(category._id)}
                    />
                  ))}
                </ScrollView>
                <ScrollView
                  style={styles.landingScroll}
                  contentContainerStyle={styles.landingContent}
                  showsVerticalScrollIndicator={false}
                >
                  {categorySections.filter(category => String(category._id) === String(activeCategory)).map(category => {
                    const subcategories = category._subcategories.slice(0, 6);
                    return (
                    <View key={String(category._id)} style={styles.categorySection}>
                      <Text style={styles.categorySectionTitle}>{category._name}</Text>
                      <View style={styles.subcategoryPanel}>
                        <View style={styles.subcategoryGrid}>
                          {subcategories.map((subcategory, index) => {
                            const name = subcategory.sub_category_name || subcategory.category_name ||
                              subcategory.name || subcategory.label || subcategory.title || 'Products';
                            const imageSource = getSubcategoryImage(subcategory);
                            const discount = getDiscountLabel(subcategory);
                            return (
                              <TouchableOpacity
                                key={String(subcategory.sub_category_id || subcategory.category_id || subcategory.id || index)}
                                style={styles.subcategoryTile}
                                activeOpacity={0.85}
                                onPress={() => openSubcategory(category, subcategory)}
                              >
                                <LinearGradient colors={['#FED7D4', '#E0C763']} style={styles.subcategoryTileGradient}>
                                  <Text style={styles.subcategoryName} numberOfLines={2}>{name}</Text>
                                  {!!discount && <Text style={styles.subcategoryDiscount} numberOfLines={1}>{discount}</Text>}
                                  <View style={styles.subcategoryImageSpacer} />
                                  {imageSource ? (
                                    <Image source={imageSource} style={styles.subcategoryImage} resizeMode="contain" />
                                  ) : (
                                    <View style={styles.subcategoryImagePlaceholder} />
                                  )}
                                </LinearGradient>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                        <TouchableOpacity
                          style={styles.viewAllButton}
                          activeOpacity={0.8}
                          onPress={() => handleCategoryPress(category._id)}
                        >
                          <Text style={styles.viewAllText}>View all {category._name} products</Text>
                          <ChevronRight size={15} color="#1768D2" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    );
                  })}
                </ScrollView>
              </View>
            </LinearGradient>
          )}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  landingBackground: { flex: 1 },
  categoryBrowser: { flex: 1, flexDirection: 'row' },
  categorySidebar: { width: 80, flexGrow: 0, flexShrink: 0, backgroundColor: '#F4F5FF', borderRightWidth: 1, borderRightColor: '#E3E6F1' },
  categorySidebarContent: { paddingVertical: 8 },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF' },
  landingHeader: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: 'transparent',
  },
  landingTitle: { color: '#263077', fontSize: 17, fontWeight: '500' },
  landingScroll: { flex: 1, backgroundColor: 'transparent' },
  landingContent: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 96 },
  categorySection: { marginBottom: 28 },
  categorySectionTitle: {
    color: '#263077',
    fontSize: 19,
    fontWeight: '500',
    marginBottom: 11,
  },
  subcategoryPanel: { borderRadius: 12, padding: 9, backgroundColor: 'transparent' },
  subcategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', rowGap: 7 },
  subcategoryTile: {
    width: SUBCATEGORY_TILE_WIDTH,
    height: 132,
    borderRadius: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  subcategoryTileGradient: { flex: 1, borderRadius: 8, paddingHorizontal: 8, paddingTop: 9, paddingBottom: 0, flexDirection: 'column' },
  subcategoryName: { color: '#693410', fontSize: 12, lineHeight: 14, minHeight: 28, fontWeight: '600', textAlign: 'center' },
  subcategoryDiscount: { color: '#693410', fontSize: 10, lineHeight: 12, marginTop: 1 },
  subcategoryImageSpacer: { flex: 1, minHeight: 0 },
  subcategoryImage: { width: '100%', height: 80, flexShrink: 0, alignSelf: 'center' },
  subcategoryImagePlaceholder: { width: '100%', height: 80, flexShrink: 0 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, marginBottom: 2 },
  viewAllText: { color: '#1768D2', fontSize: 13, fontWeight: '500', marginRight: 3 },
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
