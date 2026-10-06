import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react-native';
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
      navigation.navigate('Login', { returnTo: { name: 'PaymentMethod' } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {!hasItems ? (
        <>
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
          </LinearGradient>
          <View style={styles.emptyCart}>
            <View style={styles.emptyCartIcon}>
              <ShoppingBag size={38} color="#2CB7DF" />
            </View>
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartMessage}>
              Browse medicines and add the items you need.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.shopButtonText}>Continue shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
      <>
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

        <GetOTPButton
          label={isUserLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
          onPress={handleCheckoutPress}
        />
      </>
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
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  emptyCartIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(44, 183, 223, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#043250',
  },
  emptyCartMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#787887',
    textAlign: 'center',
    lineHeight: 20,
  },
  shopButton: {
    marginTop: 24,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#2CB7DF',
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CartScreen;
