import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';

const WishlistScreen = ({ navigation }) => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      product_id: 201,
      product_name: 'Accu-Chek Active Test Strips (50 Strips)',
      product_sell_price: 975,
      product_mrp: 1049,
      unit: '50 Strips Box',
      image: 'https://via.placeholder.com/150',
    },
    {
      product_id: 202,
      product_name: 'Dettol Instant Hand Sanitizer 500ml',
      product_sell_price: 220,
      product_mrp: 250,
      unit: '500 ml Bottle',
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const handleRemove = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.product_id !== id));
  };

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
    navigation.navigate('Cart');
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.unitText}>{item.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{item.product_sell_price}</Text>
          {item.product_mrp && (
            <Text style={styles.mrpText}>₹{item.product_mrp}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.actionsCol}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemove(item.product_id)}>
          <Trash2 size={18} color="#FF4D4D" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
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

      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.product_id.toString()}
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
