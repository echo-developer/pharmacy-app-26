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
import { ArrowLeft, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import CartFloatingBar from '../../components/cart/CartFloatingBar';

const ProductsScreen = ({ navigation }) => {
  const route = useRoute();
  const { title = 'Products', category_id } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, [category_id]);

  const updateCartCount = () => {
    const cart = store.getState().GlobalReducer.cart;
    setCartCount(cart?.items?.length || 0);
  };

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
          // Fallback demo data if API returns empty
          setProducts([
            {
              product_id: 101,
              product_name: 'Dettol Antiseptic Liquid',
              product_sell_price: 185,
              product_mrp: 210,
              unit: '500 ml',
              image: 'https://via.placeholder.com/150',
            },
            {
              product_id: 102,
              product_name: 'Revital H Daily Multivitamin',
              product_sell_price: 310,
              product_mrp: 350,
              unit: '30 Capsules',
              image: 'https://via.placeholder.com/150',
            },
          ]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('Products API Error:', err);
      });
  };

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
    updateCartCount();
  };

  const renderProductCard = ({ item }) => (
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

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addBtnText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
});

export default ProductsScreen;
