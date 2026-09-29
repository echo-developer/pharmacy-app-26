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
} from 'react-native';
import { ArrowLeft, Search, ShoppingBag, SlidersHorizontal, Minus, Plus } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import CartFloatingBar from '../../components/cart/CartFloatingBar';

const ProductsScreen = ({ navigation }) => {
  const route = useRoute();
  const { title = 'Products', category_id } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live cart from Redux — causes re-render when cart changes
  const cart = useSelector(state => state.GlobalReducer.cart);
  const cartCount = cart?.items?.length || 0;

  const getCartQty = (product_id) => {
    if (!cart?.items) return 0;
    const item = cart.items.find(o => Math.abs(o.product_id) === Math.abs(product_id));
    return item ? item.cartqty : 0;
  };

  useEffect(() => {
    fetchProducts();
  }, [category_id]);

  const fetchProducts = () => {
    setLoading(true);
    CommonService._callApi({
      api: '/product/list',
      method: 'GET',
      urlParams: {
        category_id: category_id || '',
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
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterChip}>
          <SlidersHorizontal size={14} color="#043250" style={{ marginRight: 6 }} />
          <Text style={styles.filterChipText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Sort: Relevance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>In Stock</Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCT GRID */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item, index) => item.product_id?.toString() || index.toString()}
          renderItem={renderProductCard}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          extraData={cart}
        />
      )}
      <CartFloatingBar />
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
});

export default ProductsScreen;
