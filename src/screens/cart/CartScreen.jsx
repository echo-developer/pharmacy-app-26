import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CartHeader from '../../components/cart/CartHeader';
import SavingsBanner from '../../components/cart/SavingsBanner';
import DeliveryTimeRow from '../../components/cart/DeliveryTimeRow';
import CartItemsList from '../../components/cart/CartItemList';
import BeforeYouBuy from '../../components/cart/BeforeYouBuy';
import ViewCoupons from '../../components/cart/ViewCoupons';
import BillDetails from '../../components/cart/BillDetails';
import DeliveryAddress from '../../components/cart/DeliveryAddress';
import GetOTPButton from '../../components/cart/GetOTPButton';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const CartScreen = ({ navigation }) => {
  const [cartloader, setCartloader] = useState(false);
  const [cartcalc, setCartcalc] = useState(null);
  const [coupon, setCoupon] = useState('');

  // Reactive cart state — updated whenever Redux store changes
  const [cartState, setCartState] = useState(() => {
    const s = store.getState().GlobalReducer.cart;
    return s ? { ...s } : { items: [] };
  });

  const calculateSubTotal = (items) => {
    if (items && items.length > 0) {
      return items.reduce((sum, o) => sum + Math.abs(o.price || 0) * o.cartqty, 0);
    }
    return 0;
  };

  const calculateDiscountTotal = (items) => {
    if (items && items.length > 0) {
      const mrpTotal = items.reduce((sum, o) => sum + Math.abs(o.mrp || o.price || 0) * o.cartqty, 0);
      return Math.max(0, mrpTotal - calculateSubTotal(items));
    }
    return 0;
  };

  const calculateGrandTotal = (items) => calculateSubTotal(items);

  const cartCheck = () => {
    const cart = store.getState().GlobalReducer.cart;
    if (cart?.items?.length > 0) {
      setCartloader(true);
      const inputdata = new FormData();
      inputdata.append('pincode', store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '');
      inputdata.append('address_id', store.getState().GlobalReducer.chosencity?.tempaddress?.place_id || '');
      inputdata.append('couponcode', coupon);
      inputdata.append('cartdata', JSON.stringify(cart.items));
      inputdata.append('member_id', store.getState().GlobalReducer.authuser?.member_id || '');

      CommonService._callApi({
        api: '/cart/check',
        method: 'CONVERT',
        body: inputdata,
      })
        .then(response => response.json())
        .then(resp => {
          setCartloader(false);
          if (resp.status == 1) {
            setCartcalc(resp.response.data);
          }
        })
        .catch(error => {
          setCartloader(false);
          console.log('Cart API Error:', error);
        });
    }
  };

  // Sync cart from store before first paint so Buy Now items are visible immediately
  useLayoutEffect(() => {
    const fresh = store.getState().GlobalReducer.cart;
    setCartState(fresh ? { ...fresh } : { items: [] });
  }, []);

  useEffect(() => {
    cartCheck();

    const unsubscribe = store.subscribe(() => {
      const updated = store.getState().GlobalReducer.cart;
      setCartState(updated ? { ...updated } : { items: [] });
    });

    // Re-read on every screen focus (handles Buy Now navigation)
    const focusSub = navigation.addListener('focus', () => {
      const focused = store.getState().GlobalReducer.cart;
      setCartState(focused ? { ...focused } : { items: [] });
      cartCheck();
    });

    return () => {
      unsubscribe();
      focusSub();
    };
  }, [navigation]);

  const handleQtyChange = (id, qty) => {
    if (qty === 0) {
      CommonService.removeCart(id);
    } else {
      const currentCart = store.getState().GlobalReducer.cart;
      const item = currentCart?.items?.find(i => Math.abs(i.product_id) === Math.abs(id));
      if (item) {
        const delta = qty - item.cartqty;
        if (delta > 0) {
          CommonService.addToCart({ ...item });
        } else {
          CommonService.decreaseCart(id);
        }
      }
    }
    setTimeout(() => cartCheck(), 300);
  };

  const cart = cartState;
  const items = cart?.items || [];
  const hasItems = items.length > 0;
  const isUserLoggedIn = Boolean(store.getState().GlobalReducer.authuser);

  const handleCheckoutPress = () => {
    if (isUserLoggedIn) {
      navigation.navigate('PaymentMethod');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {cartloader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient
            colors={['#F4F5FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.topGradient}
          >
            <CartHeader
              title="Cart"
              onBackPress={() => navigation.goBack()}
              onSearchPress={() => navigation.navigate('Search')}
            />
            <SavingsBanner amount={`₹${calculateDiscountTotal(items)}`} />
            <DeliveryTimeRow time="30 mins" />
          </LinearGradient>
          <CartItemsList
            items={items}
            onQtyChange={handleQtyChange}
          />
          <BeforeYouBuy
            onProductPress={product => navigation.navigate('ProductDetails', { id: product.product_id, product: product })}
            onAddPress={product => CommonService.addToCart(product)}
            onFavPress={product => console.log('Favorite pressed', product)}
          />
          <ViewCoupons
            label="View Coupons & Offers"
            onPress={() => console.log('View Coupons pressed')}
          />
          <BillDetails
            subtotal={calculateSubTotal(items)}
            discount={calculateDiscountTotal(items)}
            total={calculateGrandTotal(items)}
          />
          <DeliveryAddress
            title="Delivering to House"
            address={store.getState().GlobalReducer.chosencity?.tempaddress?.address || 'Sector F, South Kolkata, 700107'}
            onEditPress={() => navigation.navigate('MyAddress')}
          />
        </ScrollView>
      )}
      {hasItems && (
        <GetOTPButton
          label={isUserLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
          onPress={handleCheckoutPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topGradient: {
    paddingBottom: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default CartScreen;
