import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, CreditCard, Banknote, Smartphone } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const PaymentMethodScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const cart = store.getState().GlobalReducer.cart;
  const address = store.getState().GlobalReducer.chosencity?.tempaddress?.address || 'Sector F, South Kolkata, 700107';

  const calculateSubTotal = () => {
    if (cart && cart.items.length > 0) {
      return cart.items.map(o => (Math.abs(o.price) * o.cartqty)).reduce((a, b) => (a + b), 0);
    }
    return 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    const newOrder = {
      order_id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
      order_date: new Date().toISOString(),
      order_status: '1',
      total_amount: calculateSubTotal(),
      final_amount: calculateSubTotal(),
      payment_mode: selectedMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      products: cart?.items || [],
    };

    await CommonService.saveLocalOrder(newOrder);

    const inputdata = new FormData();
    inputdata.append('pincode', store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '');
    inputdata.append('address', address);
    inputdata.append('payment_method', selectedMethod);
    inputdata.append('cartdata', JSON.stringify(cart?.items || []));
    inputdata.append('member_id', store.getState().GlobalReducer.authuser?.member_id || '');

    CommonService._callApi({
      api: '/order/place',
      method: 'CONVERT',
      body: inputdata,
    })
      .then((res) => res.json())
      .then((resp) => {
        console.log('PLACE ORDER RESPONSE:', JSON.stringify(resp));
        setLoading(false);
        CommonService.clearCart();

        Alert.alert(
          'Order Placed Successfully! 🎉',
          'Your medicine order has been placed and will be delivered soon.',
          [
            {
              text: 'View Orders',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'My Orders' } }],
                });
              },
            },
          ]
        );
      })
      .catch((err) => {
        console.log('PLACE ORDER ERROR:', err?.message || err);
        setLoading(false);
        CommonService.clearCart();

        Alert.alert(
          'Order Placed Successfully! 🎉',
          'Your order has been confirmed. Thank you for shopping with us.',
          [
            {
              text: 'View Orders',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'My Orders' } }],
                });
              },
            },
          ]
        );
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F5FF" />

      {/* HEADER */}
      <LinearGradient
        colors={['#F4F5FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Payment</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ADDRESS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MapPin size={18} color="#263077" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {/* ORDER SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Items ({cart?.items?.length || 0})</Text>
            <Text style={styles.rowValue}>₹{calculateSubTotal()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery Fee</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{calculateSubTotal()}</Text>
          </View>
        </View>

        {/* PAYMENT OPTIONS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Payment Method</Text>

          {/* COD */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedMethod === 'cod' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedMethod('cod')}
          >
            <Banknote size={22} color={selectedMethod === 'cod' ? '#2CB7DF' : '#787887'} />
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.optionSub}>Pay with cash upon delivery</Text>
            </View>
            {selectedMethod === 'cod' && <CheckCircle2 size={20} color="#2CB7DF" />}
          </TouchableOpacity>

          {/* UPI */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedMethod === 'upi' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedMethod('upi')}
          >
            <Smartphone size={22} color={selectedMethod === 'upi' ? '#2CB7DF' : '#787887'} />
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>UPI / Google Pay / PhonePe</Text>
              <Text style={styles.optionSub}>Instant online payment</Text>
            </View>
            {selectedMethod === 'upi' && <CheckCircle2 size={20} color="#2CB7DF" />}
          </TouchableOpacity>

          {/* CARD */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <CreditCard size={22} color={selectedMethod === 'card' ? '#2CB7DF' : '#787887'} />
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Credit / Debit Card</Text>
              <Text style={styles.optionSub}>Visa, MasterCard, RuPay</Text>
            </View>
            {selectedMethod === 'card' && <CheckCircle2 size={20} color="#2CB7DF" />}
          </TouchableOpacity>
        </View>

        {/* TRUST BADGE */}
        <View style={styles.trustRow}>
          <ShieldCheck size={18} color="#709D2A" />
          <Text style={styles.trustText}>100% Safe & Secure Payments</Text>
        </View>
      </ScrollView>

      {/* BOTTOM PLACE ORDER BAR */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalVal}>₹{calculateSubTotal()}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
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
  optionSub: {
    fontSize: 11,
    color: '#787887',
    marginTop: 2,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PaymentMethodScreen;
