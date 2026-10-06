import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';
import StaticConst from '../../utils/StaticConst';
import StatusModal from '../../components/common/StatusModal';
import store from '../../store/store';

const PaymentMethodScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // 'COD' | 'ONLINE'
  const [loading, setLoading] = useState(false);
  const [statusModalConfig, setStatusModalConfig] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    orderId: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    onPrimaryPress: () => { },
    onSecondaryPress: () => { },
  });

  const [screenState, setScreenState] = useState(store.getState().GlobalReducer);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setScreenState(store.getState().GlobalReducer);
    });
    const focusSub = navigation.addListener('focus', () => {
      setScreenState(store.getState().GlobalReducer);
    });
    return () => {
      unsubscribe();
      focusSub();
    };
  }, [navigation]);

  const cart = screenState.cart;
  const authuser = screenState.authuser;
  const address = screenState.chosencity?.tempaddress?.address || '';
  const pincode = screenState.chosencity?.tempaddress?.postalcode || '';
  const placeId = screenState.chosencity?.tempaddress?.place_id || '';

  const hasValidPlaceId = Number.isInteger(Number(placeId)) && Number(placeId) > 0;
  const hasAddress = Boolean(address && pincode && hasValidPlaceId);

  const calculateSubTotal = () => {
    if (cart?.items?.length > 0) {
      return cart.items.reduce((sum, o) => sum + Math.abs(o.price) * o.cartqty, 0);
    }
    return 0;
  };

  const subTotal = calculateSubTotal();

  // ─── Modal helpers ────────────────────────────────────────────────────────

  const hideStatusModal = () => {
    setStatusModalConfig(prev => ({ ...prev, visible: false }));
  };

  const showSuccessModal = ({ title, message, orderId }) => {
    setStatusModalConfig({
      visible: true,
      type: 'success',
      title,
      message,
      orderId: orderId || '',
      primaryButtonText: 'View Orders',
      secondaryButtonText: 'Continue Shopping',
      onPrimaryPress: () => {
        hideStatusModal();
        CommonService.clearCart();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'My Orders' } }],
        });
      },
      onSecondaryPress: () => {
        hideStatusModal();
        CommonService.clearCart();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home' } }],
        });
      },
    });
  };

  const showErrorModal = ({ title, message, retryCallback }) => {
    setStatusModalConfig({
      visible: true,
      type: 'error',
      title,
      message,
      orderId: '',
      primaryButtonText: 'Retry',
      secondaryButtonText: 'Close',
      onPrimaryPress: () => {
        hideStatusModal();
        if (typeof retryCallback === 'function') retryCallback();
      },
      onSecondaryPress: hideStatusModal,
    });
  };

  const triggerRazorpayCheckoutWithOptions = (options, orderId, amount) => {
    RazorpayCheckout.open(options)
      .then(rzrData => {
        if (rzrData?.razorpay_order_id) {
          setLoading(true);
          const rzrfd = new FormData();
          rzrfd.append('razorpay_order_id', rzrData.razorpay_order_id);
          rzrfd.append('razorpay_payment_id', rzrData.razorpay_payment_id);
          rzrfd.append('razorpay_signature', rzrData.razorpay_signature);
          CommonService._callApi({
            api: '/cart/verifypayment',
            method: 'CONVERT',
            body: rzrfd,
          })
            .then(r => r.json())
            .then(rzrResp => {
              setLoading(false);
              if (rzrResp.status == 1) {
                onOrderSuccess(orderId);
              } else {
                showErrorModal({
                  title: 'Payment Failed',
                  message: 'Failed to process payment, something is wrong',
                  retryCallback: () => openRazorpay(orderId, amount),
                });
              }
            })
            .catch(() => {
              setLoading(false);
              showErrorModal({
                title: 'Payment Failed',
                message: 'Payment verification failed',
                retryCallback: () => openRazorpay(orderId, amount),
              });
            });
        } else {
          showErrorModal({
            title: 'Payment Failed',
            message: 'Failed to process payment, something is wrong',
            retryCallback: () => openRazorpay(orderId, amount),
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('Razorpay dismiss/cancel:', err);
        // If user cancelled, don't force order success
        if (err?.code === 0 || err?.description?.toLowerCase().includes('cancel')) {
          showErrorModal({
            title: 'Payment Cancelled',
            message: 'You cancelled the online payment transaction.',
            retryCallback: () => openRazorpay(orderId, amount),
          });
        } else {
          // On any other error, show error modal
          showErrorModal({
            title: 'Payment Failed',
            message: 'Failed to complete payment. Please try again later.',
            retryCallback: () => openRazorpay(orderId, amount),
          });
        }
      });
  };

  const openRazorpay = (orderId, amount) => {
    setLoading(true);

    // Get current auth data from store
    const currentState = store.getState().GlobalReducer;
    const currentAuth = currentState.authuser;

    CommonService._callApi({
      api: '/cart/createrarororder',
      method: 'GET',
      urlParams: { order_id: orderId },
    })
      .then(resp => {
        setLoading(false);
        const data = resp.data;
        if (data.status == 1 && data.response?.data?.id) {
          const options = {
            description: 'Order Payment',
            image: StaticConst.domainname + '/useruploads/site-logo/logo.png',
            currency: 'INR',
            key: data.response.data.RazorpayKey,
            amount: amount,
            name: 'Order #' + orderId,
            order_id: data.response.data.id,
            prefill: {
              email: currentAuth?.member_email || 'user@example.com',
              contact: currentAuth?.member_phone || '9876543210',
              name: currentAuth?.member_name || 'Customer',
            },
            theme: { color: '#2CB7DF' },
          };
          triggerRazorpayCheckoutWithOptions(options, orderId, amount);
        } else {
          setLoading(false);
          showErrorModal({
            title: 'Payment Failed',
            message: 'Unable to initialize payment. Please try again.',
            retryCallback: () => openRazorpay(orderId, amount),
          });
        }
      })
      .catch(() => {
        setLoading(false);
        showErrorModal({
          title: 'Payment Failed',
          message: 'Unable to initialize payment. Please try again.',
          retryCallback: () => openRazorpay(orderId, amount),
        });
      });
  };

  // ─── Order success ────────────────────────────────────────────────────────

  const onOrderSuccess = async (orderId) => {
    // Read fresh state so we capture the actual order contents
    const freshState = store.getState().GlobalReducer;
    const freshCart = freshState.cart;
    const freshSubTotal = freshCart?.items?.length
      ? freshCart.items.reduce((sum, o) => sum + Math.abs(o.price) * o.cartqty, 0)
      : subTotal;

    // Save locally so My Orders screen shows it even if server list is slow
    await CommonService.saveLocalOrder({
      order_id: orderId,
      order_date: new Date().toISOString(),
      order_status: '1',
      order_status_name: 'Placed',
      final_amount: freshSubTotal,
      order_total: freshSubTotal,
      products: freshCart?.items || [],
    });

    showSuccessModal({
      title: 'Order Placed! 🎉',
      message: 'Your order has been confirmed and will be delivered soon.',
      orderId: orderId,
    });
  };

  // ─── Place order ──────────────────────────────────────────────────────────

  const handlePlaceOrder = () => {
    // Always read fresh state at submission time (mirrors grocery app behaviour)
    const freshState = store.getState().GlobalReducer;
    const freshAuthuser = freshState.authuser;
    const freshCart = freshState.cart;
    const freshPincode = freshState.chosencity?.tempaddress?.postalcode || '';
    const freshPlaceId = freshState.chosencity?.tempaddress?.place_id || '';
    const freshAddress = freshState.chosencity?.tempaddress?.address || '';
    const freshHasAddress = Boolean(
      freshAddress && freshPincode && Number.isInteger(Number(freshPlaceId)) && Number(freshPlaceId) > 0,
    );

    if (!freshAuthuser?.member_id) {
      showErrorModal({
        title: 'Session Expired',
        message: 'Please sign in again to continue placing your order.',
        retryCallback: () => navigation.navigate('Login'),
      });
      return;
    }

    if (!paymentMethod) {
      showErrorModal({
        title: 'Select Payment Method',
        message: 'Please choose a payment method to continue.',
        retryCallback: hideStatusModal,
      });
      return;
    }

    if (!freshCart?.items?.length) {
      showErrorModal({
        title: 'Cart is Empty',
        message: 'Please add items to your cart before placing an order.',
        retryCallback: hideStatusModal,
      });
      return;
    }

    if (freshCart.items.some(isProductOutOfStock)) {
      showErrorModal({
        title: 'Item Out of Stock',
        message: 'Remove unavailable items from your cart before placing the order.',
        retryCallback: hideStatusModal,
      });
      return;
    }

    if (!freshHasAddress) {
      showErrorModal({
        title: 'Address Required',
        message: 'Please select a delivery address before placing your order.',
        retryCallback: () => navigation.navigate('MyAddress'),
      });
      return;
    }

    setLoading(true);

    // Backend expects a JSON body (not FormData) with items as [{product_id, qty}].
    // The server prices items live from the DB — we only need product_id + qty.
    const orderBody = {
      items: freshCart.items.map(item => ({
        product_id: item.product_id,
        qty: item.cartqty,
      })),
      place_id: parseInt(freshPlaceId, 10),
      pincode: freshPincode,
      payment_method: paymentMethod === 'ONLINE' ? 'razorpay' : 'cod',
      coupon: freshCart.coupon || '',
      delivery_date: freshCart.slot || '',
    };

    console.log('PLACE ORDER BODY:', JSON.stringify(orderBody));

    CommonService._callApi({
      api: '/cart/place_order',
      method: 'POST',
      body: JSON.stringify(orderBody),
    })
      .then(async r => {
        const text = await r.text();
        console.log('PLACE ORDER RAW:', text);
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) throw new Error('Invalid response');
        return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      })
      .then(resp => {
        setLoading(false);
        console.log('PLACE ORDER PARSED:', JSON.stringify(resp));

        if (resp.status == 1 && (resp.response?.data?.order_id || resp.response?.order_id)) {
          const orderId = resp.response?.data?.order_id || resp.response?.order_id;
          const billAmount = resp.response?.data?.total || resp.response?.total
            || freshCart.items.reduce((s, o) => s + Math.abs(o.price) * o.cartqty, 0);
          if (paymentMethod === 'ONLINE') {
            openRazorpay(orderId, billAmount);
          } else {
            onOrderSuccess(orderId);
          }
        } else {
          // If server says no valid items, the cart has stale/invalid product IDs.
          // Clear the cart so the user starts fresh with real products.
          const msg = resp.response?.message || '';
          if (msg.toLowerCase().includes('no valid items')) {
            CommonService.clearCart();
          }
          showErrorModal({
            title: 'Order Failed',
            message: msg || 'Unable to place your order right now. Please try again.',
            retryCallback: handlePlaceOrder,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('PLACE ORDER ERROR:', err?.message);
        showErrorModal({
          title: 'Order Failed',
          message: 'Unable to place your order right now. Please try again.',
          retryCallback: handlePlaceOrder,
        });
      });
  };

  // ─── UI ───────────────────────────────────────────────────────────────────

  const getButtonText = () => {
    if (paymentMethod === 'ONLINE') return 'Pay Now';
    if (paymentMethod === 'COD') return 'Place Order';
    return 'Select Payment Method';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F5FF" />

      {/* HEADER */}
      <LinearGradient
        colors={['#F4F5FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Payment</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ADDRESS CARD */}
        <TouchableOpacity
          style={[styles.card, !hasAddress && styles.cardWarning]}
          onPress={() => navigation.navigate('MyAddress')}
          activeOpacity={0.85}>
          <View style={styles.cardHeaderRow}>
            <MapPin size={18} color={hasAddress ? '#263077' : '#EF4444'} style={{ marginRight: 6 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0, flex: 1 }]}>Delivery Address</Text>
            <Text style={styles.changeText}>{hasAddress ? 'Change' : 'Select'}</Text>
          </View>
          <Text style={[styles.addressText, !hasAddress && { color: '#EF4444', marginTop: 6 }]}>
            {hasAddress ? address : '⚠️  No address selected — tap to select'}
          </Text>
          {pincode ? <Text style={styles.pincodeText}>Pincode: {pincode}</Text> : null}
        </TouchableOpacity>

        {/* ORDER SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Items ({cart?.items?.length || 0})</Text>
            <Text style={styles.rowValue}>₹{subTotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery Fee</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{subTotal}</Text>
          </View>
        </View>

        {/* PAYMENT OPTIONS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Payment Method</Text>

          {/* Razorpay — UPI / Cards / Net Banking */}
          <Pressable
            style={[styles.paymentOption, paymentMethod === 'ONLINE' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('ONLINE')}>
            <Smartphone size={22} color={paymentMethod === 'ONLINE' ? '#2CB7DF' : '#787887'} />
            <View style={styles.optionTextCol}>
              <Text style={[styles.optionTitle, paymentMethod === 'ONLINE' && styles.optionTitleActive]}>
                UPI / Cards / Net Banking
              </Text>
              <Text style={styles.optionSub}>Google Pay, PhonePe, Razorpay</Text>
            </View>
            {paymentMethod === 'ONLINE' && (
              <View style={styles.radioSelected} />
            )}
          </Pressable>

          {/* COD */}
          <Pressable
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('COD')}>
            <Banknote size={22} color={paymentMethod === 'COD' ? '#2CB7DF' : '#787887'} />
            <View style={styles.optionTextCol}>
              <Text style={[styles.optionTitle, paymentMethod === 'COD' && styles.optionTitleActive]}>
                Cash on Delivery
              </Text>
              <Text style={styles.optionSub}>Pay with cash upon delivery</Text>
            </View>
            {paymentMethod === 'COD' && (
              <View style={styles.radioSelected} />
            )}
          </Pressable>
        </View>

        {/* TRUST BADGE */}
        <View style={styles.trustRow}>
          <ShieldCheck size={16} color="#709D2A" />
          <Text style={styles.trustText}>100% Safe & Secure Payments</Text>
        </View>

      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalVal}>₹{subTotal}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, !paymentMethod && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={!paymentMethod || loading}>
          <Text style={styles.placeOrderText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>

      {/* LOADER OVERLAY */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      )}

      {/* STATUS MODAL */}
      <StatusModal
        visible={statusModalConfig.visible}
        type={statusModalConfig.type}
        title={statusModalConfig.title}
        message={statusModalConfig.message}
        orderId={statusModalConfig.orderId}
        onClose={hideStatusModal}
        onPrimaryPress={statusModalConfig.onPrimaryPress}
        onSecondaryPress={statusModalConfig.onSecondaryPress}
        primaryButtonText={statusModalConfig.primaryButtonText}
        secondaryButtonText={statusModalConfig.secondaryButtonText}
      />
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 48,
    paddingBottom: 16,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#787887',
    lineHeight: 18,
  },
  pincodeText: {
    fontSize: 12,
    color: '#263077',
    fontWeight: '600',
    marginTop: 4,
  },
  cardWarning: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2CB7DF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: '#787887',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#043250',
  },
  freeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#709D2A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#043250',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263077',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  paymentOptionSelected: {
    borderColor: '#2CB7DF',
    backgroundColor: 'rgba(44, 183, 223, 0.05)',
  },
  optionTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#043250',
  },
  optionTitleActive: {
    color: '#2CB7DF',
  },
  optionSub: {
    fontSize: 11,
    color: '#787887',
    marginTop: 2,
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2CB7DF',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#2CB7DF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#709D2A',
    fontWeight: '600',
    marginLeft: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    elevation: 8,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: '#787887',
  },
  bottomTotalVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#263077',
  },
  placeOrderBtn: {
    backgroundColor: '#2CB7DF',
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#B0D9E8',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loaderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentMethodScreen;
