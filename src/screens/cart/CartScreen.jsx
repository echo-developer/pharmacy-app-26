import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
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
  // Live cart from Redux — re-renders instantly on any cart change
  const cart = useSelector(state => state.GlobalReducer.cart);
  const items = cart?.items || [];
  const hasItems = items.length > 0;

  // Auto go back when cart becomes empty (last item removed via stepper)
  useEffect(() => {
    if (!hasItems) {
      navigation.goBack();
    }
  }, [hasItems]);

  const isUserLoggedIn = Boolean(store.getState().GlobalReducer.authuser);

  const calculateSubTotal = (list) =>
    (list || []).reduce((sum, o) => sum + Math.abs(o.price || 0) * o.cartqty, 0);

  const calculateDiscountTotal = (list) => {
    const mrpTotal = (list || []).reduce(
      (sum, o) => sum + Math.abs(o.mrp || o.price || 0) * o.cartqty,
      0,
    );
    return Math.max(0, mrpTotal - calculateSubTotal(list));
  };

  const calculateGrandTotal = (list) => calculateSubTotal(list);

  const handleQtyChange = (id, qty) => {
    if (qty === 0) {
      CommonService.removeCart(id);
    } else {
      const currentCart = store.getState().GlobalReducer.cart;
      const item = currentCart?.items?.find(
        i => Math.abs(i.product_id) === Math.abs(id),
      );
      if (item) {
        if (qty > item.cartqty) {
          CommonService.addToCart({ ...item });
        } else {
          CommonService.decreaseCart(id);
        }
      }
    }
  };

  const handleCheckoutPress = () => {
    if (isUserLoggedIn) {
      navigation.navigate('PaymentMethod');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

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

        <CartItemsList items={items} onQtyChange={handleQtyChange} />

        <BeforeYouBuy
          onProductPress={product =>
            navigation.navigate('ProductDetails', {
              id: product.product_id,
              product: product,
            })
          }
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
          address={
            store.getState().GlobalReducer.chosencity?.tempaddress?.address ||
            'Sector F, South Kolkata, 700107'
          }
          onEditPress={() => navigation.navigate('MyAddress')}
        />
      </ScrollView>

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
  topGradient: {
    paddingBottom: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default CartScreen;
