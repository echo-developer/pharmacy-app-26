import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CartHeader from '../../components/cart/CartHeader';
import SavingsBanner from '../../components/cart/SavingsBanner';
import DeliveryTimeRow from '../../components/cart/DeliveryTimeRow';
import CartItemsList from '../../components/cart/CartItemList';
import BeforeYouBuy from '../../components/cart/BeforeYouBuy';

const CartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== TOP GRADIENT WRAPPER ===== */}
        <LinearGradient
          colors={['#F4F5FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topGradient}
        >
          <CartHeader
            title="Cart"
            onBackPress={() => navigation.goBack()}
            onSearchPress={() => console.log('Search')}
          />
          <SavingsBanner amount="₹456" />
          <DeliveryTimeRow time="30 mins" />
        </LinearGradient>
             <CartItemsList
          onQtyChange={(id, qty) => console.log('Qty changed', id, qty)}
        />
        <BeforeYouBuy
          onProductPress={(product) => console.log('Product pressed', product)}
          onAddPress={(product) => console.log('Add pressed', product)} 
          onFavPress={(product) => console.log('Favorite pressed', product)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topGradient: {
    paddingBottom: 4,
  },
});

export default CartScreen;