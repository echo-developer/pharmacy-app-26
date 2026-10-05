import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ShoppingBag, RotateCcw } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonService from '../../utils/CommonService';

const BuyAgainScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    try {
      const [remote, local] = await Promise.all([
        CommonService._callApi({ api: '/orders/list', method: 'GET' }).then(r => r.data).catch(() => null),
        CommonService.getLocalOrders(),
      ]);
      const remoteOrders = remote?.status === 1 ? (Array.isArray(remote.response?.data) ? remote.response.data : Array.isArray(remote.response) ? remote.response : []) : [];
      const seen = new Map();
      [...local, ...remoteOrders].forEach(order => {
        const items = order.products || order.items || order.order_details || [];
        if (!Array.isArray(items)) return;
        items.forEach(product => {
          const id = product.product_id || product.id;
          if (id && !seen.has(String(id))) seen.set(String(id), product);
        });
      });
      setProducts([...seen.values()]);
    } finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { setLoading(true); load(); }, [load]));
  const add = async item => {
    let product = item;
    if (!item.product_sell_price && item.product_id) {
      try {
        const response = await CommonService._callApi({ api: '/product/details', method: 'GET', urlParams: { product_id: item.product_id } });
        product = response.data?.response?.data || item;
      } catch (_) { /* use order line data as fallback */ }
    }
    CommonService.addToCart({ ...product, product_id: product.product_id || product.id, product_name: product.product_name || product.name, product_sell_price: product.product_sell_price || product.sell_price || product.price, product_mrp: product.product_mrp || product.mrp, qty: product.qty || 99 });
  };
  return <View style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#fff"/><View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color="#263077"/></TouchableOpacity><View><Text style={styles.title}>Buy Again</Text><Text style={styles.sub}>Your previously ordered pharmacy items</Text></View></View>
    {loading ? <View style={styles.center}><ActivityIndicator size="large" color="#263077"/></View> : <FlatList data={products} keyExtractor={(item,i) => String(item.product_id || item.id || i)} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true);load();}}/>} ListEmptyComponent={<View style={styles.empty}><RotateCcw size={34} color="#8B91B9"/><Text style={styles.emptyTitle}>No past items to repeat</Text><Text style={styles.emptySub}>Products from your orders will appear here for quick reordering.</Text><TouchableOpacity style={styles.browse} onPress={() => navigation.navigate('Products',{title:'Browse medicines'})}><Text style={styles.browseText}>Browse products</Text></TouchableOpacity></View>}
      renderItem={({item}) => <View style={styles.card}><TouchableOpacity onPress={() => navigation.navigate('ProductDetails',{id:item.product_id || item.id,product:item})}><Image source={item.image ? {uri:item.image} : require('../../assets/images/products.png')} style={styles.image} resizeMode="contain"/></TouchableOpacity><View style={styles.info}><Text style={styles.name} numberOfLines={2}>{item.product_name || item.name || 'Pharmacy item'}</Text><Text style={styles.unit}>{item.unit || 'Previously ordered'}</Text><Text style={styles.price}>₹{item.product_sell_price || item.sell_price || item.price || '—'}</Text></View><TouchableOpacity style={styles.add} onPress={() => add(item)}><ShoppingBag size={15} color="#fff"/><Text style={styles.addText}>Add</Text></TouchableOpacity></View>}/>}</View>;
};
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#F7F8FC'},header:{paddingTop:48,paddingBottom:16,paddingHorizontal:16,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#ECEEF4'},back:{padding:6,marginRight:10},title:{fontSize:20,fontWeight:'700',color:'#18204F'},sub:{fontSize:12,color:'#6D7184',marginTop:3},center:{flex:1,alignItems:'center',justifyContent:'center'},list:{padding:14,flexGrow:1},card:{backgroundColor:'#fff',borderRadius:13,padding:12,marginBottom:10,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#ECEEF4'},image:{width:72,height:72},info:{flex:1,marginHorizontal:12},name:{fontSize:14,fontWeight:'600',color:'#222744'},unit:{fontSize:11,color:'#85899A',marginTop:5},price:{fontSize:14,fontWeight:'700',color:'#263077',marginTop:5},add:{backgroundColor:'#263077',paddingHorizontal:12,paddingVertical:9,borderRadius:8,flexDirection:'row',alignItems:'center',gap:5},addText:{color:'#fff',fontSize:12,fontWeight:'700'},empty:{flex:1,alignItems:'center',justifyContent:'center',padding:30,minHeight:400},emptyTitle:{fontSize:17,fontWeight:'700',color:'#252A44',marginTop:15},emptySub:{fontSize:13,color:'#7B7F90',textAlign:'center',marginTop:6,lineHeight:19},browse:{marginTop:18,paddingHorizontal:20,paddingVertical:11,borderRadius:8,backgroundColor:'#263077'},browseText:{color:'#fff',fontWeight:'700'}});
export default BuyAgainScreen;
