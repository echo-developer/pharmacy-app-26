import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { CachedImage as Image } from '../../components/common/CachedImage';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';
import store from '../../store/store';

const SearchScreen = ({ navigation, route }) => {
  const initialKeyword = route?.params?.keyword || route?.params?.query || route?.params?.search || '';
  const [query, setQuery] = useState(initialKeyword);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Paracetamol',
    'Vitamin C',
    'Dettol',
    'Thermometer',
    'Baby Wipes',
  ]);

  useEffect(() => {
    const paramKw = route?.params?.keyword || route?.params?.query || route?.params?.search;
    if (paramKw && paramKw !== query) {
      setQuery(paramKw);
    }
  }, [route?.params]);

  const performSearch = useCallback((keyword) => {
    if (!keyword || keyword.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const cleanKw = keyword.trim();
    CommonService._callApi({
      api: '/product/search',
      method: 'GET',
      urlParams: {
        title: cleanKw,
        keyword: cleanKw,
        query: cleanKw,
        search: cleanKw,
        pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '',
      },
    })
      .then((resp) => resp.data)
      .then((resp) => {
        if (resp && (resp.status == 1 || resp.status == 200 || resp.response)) {
          const list = Array.isArray(resp.response?.data)
            ? resp.response.data
            : Array.isArray(resp.response)
              ? resp.response
              : Array.isArray(resp.data)
                ? resp.data
                : Array.isArray(resp.products)
                  ? resp.products
                  : [];
          if (list.length > 0) {
            setResults(list);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to /product/list if /product/search returns no items
        return CommonService._callApi({
          api: '/product/list',
          method: 'GET',
          urlParams: {
            title: cleanKw,
            keyword: cleanKw,
            pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '',
          },
        })
          .then((res2) => res2.data)
          .then((res2) => {
            setLoading(false);
            const list2 = Array.isArray(res2?.response?.data)
              ? res2.response.data
              : Array.isArray(res2?.response)
                ? res2.response
                : Array.isArray(res2?.data)
                  ? res2.data
                  : [];
            setResults(list2);
          });
      })
      .catch((err) => {
        setLoading(false);
        console.log('Search Error:', err);
        setResults([]);
      });
  }, []);

  useEffect(() => {
    if (query.trim().length >= 1) {
      const timer = setTimeout(() => {
        performSearch(query);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, performSearch]);

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
  };

  const handleChipPress = (term) => {
    setQuery(term);
    performSearch(term);
  };

  const renderProductItem = ({ item }) => {
    const productId = item.product_id || item.id;
    const productName = item.product_name || item.name || item.title || 'Product';
    const productImage = item.image || item.product_image || item.img;
    const unitText = item.unit || item.pack_size || item.tablets || '1 Unit';
    const sellPrice = item.product_sell_price || item.sell_price || item.price || 0;
    const mrpPrice = item.product_mrp || item.mrp;
    const outOfStock = isProductOutOfStock(item);

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ProductDetails', { id: productId, product: item })}
      >
        <View style={styles.productImageArea}>
          <Image
            source={
              productImage && typeof productImage === 'string'
                ? { uri: productImage }
                : productImage || require('../../assets/images/products.png')
            }
            style={styles.productImage}
            resizeMode="contain"
          />
          {outOfStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          <Text style={styles.productUnit}>{unitText}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.sellPrice}>₹{sellPrice}</Text>
            {mrpPrice && parseFloat(mrpPrice) > parseFloat(sellPrice) && (
              <Text style={styles.mrpText}>₹{mrpPrice}</Text>
            )}
          </View>
        </View>
        {outOfStock ? (
          <View style={[styles.addBtn, styles.unavailableBtn]}>
            <Text style={styles.unavailableText}>OUT OF STOCK</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addBtnText}>ADD</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* SEARCH HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Search size={18} color="#787C77" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder='Search medicines, health products...'
            placeholderTextColor="#787C77"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color="#787C77" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : query.length >= 1 ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => (item.product_id || item.id || index).toString()}
            renderItem={renderProductItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try searching for something else</Text>
          </View>
        )
      ) : (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Popular Searches</Text>
          <View style={styles.chipsContainer}>
            {recentSearches.map((term, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chip}
                onPress={() => handleChipPress(term)}
              >
                <Search size={14} color="#2CB7DF" style={{ marginRight: 6 }} />
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#043250',
    paddingVertical: 0,
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  productCard: {
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
  productImageArea: {
    width: 84,
    height: 84,
    marginRight: 12,
    position: 'relative',
  },
  stockBadge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(27, 34, 50, 0.82)',
    borderRadius: 5,
    paddingVertical: 3,
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
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
  productUnit: {
    fontSize: 12,
    color: '#787887',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    marginRight: 8,
  },
  mrpText: {
    fontSize: 12,
    color: '#787887',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: 'rgba(44, 183, 223, 0.12)',
    borderWidth: 1,
    borderColor: '#2CB7DF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#2CB7DF',
    fontSize: 12,
    fontWeight: '700',
  },
  unavailableBtn: {
    backgroundColor: '#F1F2F4',
  },
  unavailableText: {
    color: '#777C85',
    fontSize: 9,
    fontWeight: '800',
  },
  recentSection: {
    padding: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    color: '#043250',
    fontWeight: '500',
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

export default SearchScreen;
