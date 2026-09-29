import React, { useState, useCallback } from 'react';
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
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const WishlistScreen = ({ navigation }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loader, setLoader] = useState(true);

  const loadWishlist = () => {
    setLoader(true);
    CommonService._callApi({
      api: '/member/favoritelist',
      method: 'GET',
      urlParams: {},
    })
      .then(r => r.data)
      .then(resp => {
        setLoader(false);
        if (resp.status == 1) {
          const raw = resp.response?.data || resp.response || [];
          setWishlistItems(Array.isArray(raw) ? raw : []);
        } else {
          setWishlistItems([]);
        }
      })
      .catch(() => {
        setLoader(false);
        setWishlistItems([]);
      });
  };

  // Reload every time screen is focused (e.g. after toggling heart on product detail)
  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const handleRemove = (product_id) => {
    // Optimistic remove from UI
    setWishlistItems(prev => prev.filter(item => Math.abs(item.product_id) !== Math.abs(product_id)));

    const inputparams = new FormData();
    inputparams.append('product_id', product_id);
    CommonService._callApi({
      api: '/member/favorite',
      method: 'CONVERT',
      body: inputparams,
    })
      .then(r => r.json())
      .then(response => {
        // Sync redux so heart on product/category screens reflects removal
        store.dispatch({
          type: 'SET_FAVORITE_STATUS',
          payload: {
            product_id: product_id,
            is_favorite: response.response?.data?.is_favorite === 1,
          },
        });
      })
      .catch(() => { });
  };

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
    navigation.navigate('Cart');
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
      >
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require('../../assets/images/products.png')
          }
          style={styles.productImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.unitText}>{item.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{item.product_sell_price}</Text>
          {item.product_mrp ? (
            <Text style={styles.mrpText}>₹{item.product_mrp}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actionsCol}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleRemove(item.product_id)}
        >
          <Trash2 size={18} color="#FF4D4D" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddToCart(item)}
        >
          <ShoppingBag size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>

      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item, idx) => (item.product_id || idx).toString()}
          renderItem={renderWishlistItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your Wishlist is empty</Text>
          <Text style={styles.emptySub}>Explore products and save items you love!</Text>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 2,
  },
  unitText: {
    fontSize: 11,
    color: '#787887',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    marginRight: 6,
  },
  mrpText: {
    fontSize: 11,
    color: '#787887',
    textDecorationLine: 'line-through',
  },
  actionsCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
  },
  deleteBtn: {
    padding: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB7DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#787887',
  },
});

export default WishlistScreen;
