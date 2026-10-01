import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { ArrowLeft, Search, ShoppingBag, SlidersHorizontal, Minus, Plus, X } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import CartFloatingBar from '../../components/cart/CartFloatingBar';
import FilterSortBar from '../../components/categories/FilterSortBar';

const ProductsScreen = ({ navigation }) => {
  const route = useRoute();
  const { title = 'Products', category_id, brand_id } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isInStockOnly, setIsInStockOnly] = useState(false);

  // Live cart from Redux — causes re-render when cart changes
  const cart = useSelector(state => state.GlobalReducer.cart);
  const cartCount = cart?.items?.length || 0;

  const getCartQty = (product_id) => {
    if (!cart?.items) return 0;
    const item = cart.items.find(o => Math.abs(o.product_id) === Math.abs(product_id));
    return item ? item.cartqty : 0;
  };

  useEffect(() => {
    fetchProducts(selectedSort, selectedDiscount, priceRange);
  }, [category_id, brand_id]);

  const fetchProducts = (
    sort = selectedSort,
    discount = selectedDiscount,
    range = priceRange
  ) => {
    setLoading(true);
    CommonService._callApi({
      api: '/product/list',
      method: 'GET',
      urlParams: {
        category_id: category_id || '',
        brand_id: brand_id || '',
        sort_by: sort,
        min_discount: discount > 0 ? discount : '',
        min: range.min > 0 ? range.min : '',
        max: range.max > 0 ? range.max : '',
        pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '',
      },
    })
      .then((resp) => resp.data)
      .then((resp) => {
        setLoading(false);
        if (resp.status == 1) {
          setProducts(resp.response.data || []);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('Products API Error:', err);
      });
  };

  const handleFilterPress = () => setFilterModalVisible(true);
  const handleSortPress = () => setSortModalVisible(true);
  const handleInStockToggle = () => setIsInStockOnly(prev => !prev);

  const applyFilter = () => {
    setFilterModalVisible(false);
    fetchProducts(selectedSort, selectedDiscount, priceRange);
  };

  const resetFilter = () => {
    setSelectedDiscount(0);
    setPriceRange({ min: 0, max: 0 });
    setFilterModalVisible(false);
    fetchProducts(selectedSort, 0, { min: 0, max: 0 });
  };

  const applySort = (sortOption) => {
    setSelectedSort(sortOption);
    setSortModalVisible(false);
    fetchProducts(sortOption, selectedDiscount, priceRange);
  };

  const getProcessedProducts = () => {
    let result = [...products];

    if (isInStockOnly) {
      result = result.filter(p => p.in_stock !== 0 && p.stock !== 0 && p.is_out_of_stock !== 1);
    }

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

  const renderProductCard = ({ item }) => {
    const qty = getCartQty(item.product_id);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
      >
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/120' }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.unitText}>{item.unit || '1 Unit'}</Text>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceText}>₹{item.product_sell_price || item.price}</Text>
            {item.product_mrp && item.product_mrp > (item.product_sell_price || item.price) && (
              <Text style={styles.mrpText}>₹{item.product_mrp}</Text>
            )}
          </View>

          {qty > 0 ? (
            // Stepper — stop card navigation on press
            <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation?.()}>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    CommonService.decreaseCart(item.product_id);
                  }}
                >
                  <Minus size={12} color="#263077" strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.stepQty}>{qty}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    CommonService.addToCart(item);
                  }}
                >
                  <Plus size={12} color="#263077" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                CommonService.addToCart(item);
              }}
            >
              <Text style={styles.addBtnText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Search')}
          >
            <Search size={20} color="#043250" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <ShoppingBag size={20} color="#263077" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER BAR */}
      <FilterSortBar
        onFilterPress={handleFilterPress}
        onSortPress={handleSortPress}
        currentSort={selectedSort}
        isInStockOnly={isInStockOnly}
        onInStockToggle={handleInStockToggle}
        hasActiveFilters={selectedDiscount > 0 || priceRange.min > 0 || priceRange.max > 0}
      />

      {/* PRODUCT GRID */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <FlatList
          data={getProcessedProducts()}
          numColumns={2}
          keyExtractor={(item, index) => item.product_id?.toString() || index.toString()}
          renderItem={renderProductCard}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          extraData={cart}
        />
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#709D2A',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  filterChipText: {
    fontSize: 12,
    color: '#043250',
    fontWeight: '600',
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#043250',
    height: 34,
    marginBottom: 4,
  },
  unitText: {
    fontSize: 11,
    color: '#787887',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
  },
  mrpText: {
    fontSize: 10,
    color: '#787887',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: 'rgba(44, 183, 223, 0.12)',
    borderWidth: 1,
    borderColor: '#2CB7DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#2CB7DF',
    fontSize: 11,
    fontWeight: '700',
  },
  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#263077',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 3,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQty: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263077',
    minWidth: 18,
    textAlign: 'center',
  },
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

export default ProductsScreen;
