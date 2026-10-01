import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ShoppingBag, Tag } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const OffersScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOffers = useCallback(() => {
    CommonService._callApi({
      api: '/product/list', method: 'GET',
      urlParams: { sort_by: 'relevance', min_discount: -1, pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '' },
    }).then(resp => {
      const body = resp.data;
      const data = body?.response?.data || body?.response || [];
      setProducts(Array.isArray(data) ? data.filter(item => Number(item.discount || 0) > 0 || Number(item.product_mrp || 0) > Number(item.product_sell_price || 0)) : []);
    }).catch(() => setProducts([])).finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); loadOffers(); }, [loadOffers]));
  const add = item => CommonService.addToCart({ ...item, qty: item.qty || 99 });

  return <View style={styles.page}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color="#263077" /></TouchableOpacity><View style={styles.titleWrap}><Text style={styles.title}>Offers for you</Text><Text style={styles.sub}>Save on medicines and wellness essentials</Text></View></View>
    {loading ? <View style={styles.center}><ActivityIndicator size="large" color="#263077" /></View> : <FlatList
      data={products} keyExtractor={(item, i) => String(item.product_id || i)} numColumns={2}
      contentContainerStyle={styles.grid} columnWrapperStyle={styles.row}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOffers(); }} />}
      ListEmptyComponent={<View style={styles.empty}><Tag size={34} color="#8B91B9"/><Text style={styles.emptyTitle}>No offers available right now</Text><Text style={styles.emptySub}>Check back soon for savings on your pharmacy essentials.</Text></View>}
      renderItem={({ item }) => <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}>
        <Image source={item.image ? { uri: item.image } : require('../../assets/images/products.png')} style={styles.image} resizeMode="contain" />
        {Number(item.discount) > 0 && <Text style={styles.badge}>{item.discount}% OFF</Text>}
        <Text style={styles.name} numberOfLines={2}>{item.product_name}</Text><Text style={styles.unit}>{item.unit || 'Healthcare product'}</Text>
        <View style={styles.priceRow}><Text style={styles.price}>₹{item.product_sell_price}</Text>{item.product_mrp ? <Text style={styles.mrp}>₹{item.product_mrp}</Text> : null}</View>
        <TouchableOpacity style={styles.add} onPress={() => add(item)}><ShoppingBag size={15} color="#fff"/><Text style={styles.addText}>Add to cart</Text></TouchableOpacity>
      </TouchableOpacity>}
    />}
  </View>;
};

const styles = StyleSheet.create({ page:{flex:1,backgroundColor:'#F7F8FC'}, header:{backgroundColor:'#fff',paddingTop:48,paddingBottom:16,paddingHorizontal:16,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#ECEEF4'},back:{padding:6,marginRight:10},titleWrap:{flex:1},title:{fontSize:20,fontWeight:'700',color:'#18204F'},sub:{fontSize:12,color:'#6D7184',marginTop:3},center:{flex:1,alignItems:'center',justifyContent:'center'},grid:{padding:12,flexGrow:1},row:{justifyContent:'space-between'},card:{width:'48.5%',backgroundColor:'#fff',borderRadius:14,padding:11,marginBottom:12,borderWidth:1,borderColor:'#ECEEF4'},image:{height:112,width:'100%',marginBottom:7},badge:{alignSelf:'flex-start',backgroundColor:'#E8F7EC',color:'#28743E',paddingHorizontal:7,paddingVertical:3,borderRadius:5,fontSize:10,fontWeight:'700',marginBottom:5},name:{fontSize:14,fontWeight:'600',color:'#222744',minHeight:38},unit:{fontSize:11,color:'#83879A',marginTop:4},priceRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:8},price:{fontSize:15,fontWeight:'700',color:'#263077'},mrp:{fontSize:12,color:'#9295A5',textDecorationLine:'line-through'},add:{height:34,borderRadius:8,marginTop:10,backgroundColor:'#263077',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},addText:{color:'#fff',fontSize:12,fontWeight:'700'},empty:{flex:1,alignItems:'center',justifyContent:'center',padding:32,minHeight:360},emptyTitle:{fontSize:17,fontWeight:'700',color:'#252A44',marginTop:15},emptySub:{fontSize:13,color:'#7B7F90',textAlign:'center',marginTop:6,lineHeight:19}});
export default OffersScreen;
