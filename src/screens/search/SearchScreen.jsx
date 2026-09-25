import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Search, X, ShoppingBag } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
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
    if (query.trim().length > 1) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = (keyword) => {
    setLoading(true);
    CommonService._callApi({
      api: '/product/search',
      method: 'GET',
      urlParams: {
        keyword: keyword,
        pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '',
      },
    })
      .then((resp) => resp.data)
      .then((resp) => {
        setLoading(false);
        if (resp.status == 1) {
          setResults(resp.response.data || []);
        } else {
          setResults([]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('Search Error:', err);
      });
  };

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.productUnit}>{item.unit || item.pack_size || '1 Unit'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.sellPrice}>₹{item.product_sell_price || item.price}</Text>
          {item.product_mrp && item.product_mrp > (item.product_sell_price || item.price) && (
            <Text style={styles.mrpText}>₹{item.product_mrp}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => handleAddToCart(item)}
      >
        <Text style={styles.addBtnText}>ADD</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
      ) : query.length > 1 ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.product_id?.toString() || index.toString()}
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
                onPress={() => setQuery(term)}
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
