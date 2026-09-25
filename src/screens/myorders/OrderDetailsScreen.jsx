import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, ActivityIndicator, Text } from 'react-native';
import OrderDetailsHeader from '../../components/orderdetails/OrderDetailsHeader';
import OrderArrivingBanner from '../../components/orderdetails/OrderArrivingBanner';
import OrderItemsStrip from '../../components/orderdetails/OrderItemsStrip';
import OrderTimelineCard from '../../components/orderdetails/OrderTimelineCard';
import OrderBillDetails from '../../components/orderdetails/OrderBillDetails';
import OrderInfoCard from '../../components/orderdetails/OrderInfoCard';
import YouMayAlsoLike from '../../components/orderdetails/YouMayAlsoLike';
import RepeatOrderButton from '../../components/orderdetails/RepeatOrderButton';
import CommonService from '../../utils/CommonService';

// Helper date formatting function replacing moment
const formatDate = (dateString, withTime = false) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (!withTime) {
    return `${day} ${month} ${year}`;
  }

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

const addDaysToDate = (dateString, days) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  date.setDate(date.getDate() + days);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const orderIdParam = route?.params?.orderId || '';
  const [loader, setLoader] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (orderIdParam) {
      loadOrderDetails(orderIdParam);
    } else {
      setLoader(false);
    }
  }, [orderIdParam]);

  const loadOrderDetails = (id) => {
    setLoader(true);
    CommonService._callApi({
      api: '/order/details',
      method: 'GET',
      urlParams: { order_id: id },
    })
      .then(async resp => {
        const res = resp.data;
        if (res.status === 1 && res.response) {
          setLoader(false);
          setOrderData(res.response);
        } else {
          const localOrders = await CommonService.getLocalOrders();
          const found = localOrders.find(o => String(o.order_id) === String(id));
          setLoader(false);
          setOrderData(found || null);
        }
      })
      .catch(async err => {
        console.log('Error fetching order details:', err);
        const localOrders = await CommonService.getLocalOrders();
        const found = localOrders.find(o => String(o.order_id) === String(id));
        setLoader(false);
        setOrderData(found || null);
      });
  };

  const getStatusBannerTitle = (status) => {
    if (status === '4' || status === 'Delivered') return 'Order Delivered';
    if (status === '7' || status === 'Cancelled') return 'Order Cancelled';
    return 'Order Arriving';
  };

  const getStatusBannerMsg = (order) => {
    if (!order) return '';
    if (order.order_status === '4' || order.order_status === 'Delivered') {
      return `Delivered on ${formatDate(order.order_date, true)}`;
    }
    if (order.order_status === '7' || order.order_status === 'Cancelled') {
      return `Cancelled on ${formatDate(order.order_date, true)}`;
    }
    return `Your Order Arriving by ${addDaysToDate(order.order_date, 3)}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <OrderDetailsHeader
        title="Order Details"
        helpLabel="Help"
        onBackPress={() => navigation.goBack()}
        onHelpPress={() => console.log('Help pressed')}
      />

      {loader ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0D7998" />
        </View>
      ) : !orderData ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Order details unavailable</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <OrderArrivingBanner
            title={getStatusBannerTitle(orderData.order_status)}
            message={getStatusBannerMsg(orderData)}
          />

          <OrderItemsStrip
            itemCount={`${orderData.products?.length || orderData.total_items || 0} items ordered`}
            images={orderData.products || [1, 2, 3, 4]}
            totalAmount={orderData.final_amount || orderData.net_amount || '0'}
            onPressItems={() => {}}
            onPayNow={() => console.log('Pay Now')}
          />

          <OrderTimelineCard
            onSeeAllUpdates={() => navigation.navigate('OrderTracking')}
          />

          <OrderBillDetails
            itemsTotal={orderData.total_amount || orderData.sub_total || '0'}
            itemsCutPrice={orderData.total_mrp || orderData.total_amount || '0'}
            deliveryCharge={orderData.shipping_charge > 0 ? `${orderData.shipping_charge}` : 'FREE'}
            handlingCharge={orderData.handling_charge || '0'}
            grandTotal={orderData.final_amount || orderData.net_amount || '0'}
            onDownloadInvoice={() => console.log('Download invoice pressed')}
          />

          <OrderInfoCard
            orderId={orderData.order_id || orderIdParam}
            payment={orderData.payment_mode || 'Cash on Delivery'}
            deliverTo={orderData.shipping_address || orderData.address || 'Address details'}
            placedDate={formatDate(orderData.order_date, true)}
          />  

          <YouMayAlsoLike
            onArrowPress={() => console.log('Arrow pressed')}
            onProductPress={(productId) => console.log(`Product ${productId} pressed`)}
            onAddPress={(productId) => console.log(`Add product ${productId} pressed`)}
          />
        </ScrollView>
      )}

      {orderData && (
        <RepeatOrderButton
          label="Repeat Order"
          onPress={() => console.log('Repeat order pressed')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',        
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#787887',
  },
  scrollContent: {
    paddingBottom: 100,                 
  },
});

export default OrderDetailsScreen;