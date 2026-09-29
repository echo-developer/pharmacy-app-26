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
import RazorpayCheckout from 'react-native-razorpay';
import StaticConst from '../../utils/StaticConst';
import store from '../../store/store';

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
  const orderIdParam = route?.params?.id || route?.params?.oid || route?.params?.orderId || '';
  const [loader, setLoader] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

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
      urlParams: { oid: id },
    })
      .then(async resp => {
        const res = resp.data;
        if (res.status === 1 && res.response && res.response.data) {
          const orderData = res.response.data;
          
          // Format statusdetails for timeline
          if (Array.isArray(orderData.statusdetails)) {
            orderData.statusdetails = orderData.statusdetails.map(sd => ({
              ...sd,
              bind_date: formatDate(sd.reg_date),
              bind_time: sd.reg_date ? new Date(sd.reg_date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              }) : '',
            }));
          }
          
          setLoader(false);
          setOrderData(orderData);
          
          // Load recommended products
          loadRecommendedProducts();
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

  const loadRecommendedProducts = () => {
    CommonService._callApi({
      api: '/product/recommended',
      method: 'GET',
      urlParams: { limit: 10 },
    })
      .then(resp => {
        const res = resp.data;
        if (res.status === 1 && res.response) {
          const products = Array.isArray(res.response.data) 
            ? res.response.data 
            : Array.isArray(res.response) 
              ? res.response 
              : [];
          setRecommendedProducts(products);
        }
      })
      .catch(err => {
        console.log('Error loading recommended products:', err);
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

  const formatAddress = (address) => {
    if (!address) return 'Address details';
    if (typeof address === 'string') return address;
    
    const { place_address, place_landmark, city, place_pincode } = address;
    const parts = [place_address, place_landmark, city, place_pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address details';
  };

  const canShowPayNow = (order) => {
    if (!order) return false;
    
    const isPaid = parseInt(order.is_paid, 10) === 1;
    const status = parseInt(order.order_status, 10);
    
    // Hide if delivered (4) or cancelled (7)
    if (status === 4 || status === 7) {
      return false;
    }
    
    // Hide if already paid
    if (isPaid) {
      return false;
    }
    
    // Only show for COD orders
    return order.payment_method === 'COD' || order.payment_mode === 'Cash on Delivery';
  };

  const handleRepeatOrder = () => {
    if (!orderData || (!orderData.items && !orderData.products)) return;
    
    const items = orderData.items || orderData.products || [];
    let addedCount = 0;
    
    items.forEach(item => {
      const productData = {
        product_id: item.product_id,
        product_name: item.product_name,
        product_sell_price: item.product_sell_price || item.price || item.sell_price,
        product_mrp: item.product_mrp || item.mrp,
        qty: item.qty || 1,
        cartqty: 1,
        discount: item.discount || '',
        unit: item.unit || '',
        image: item.image,
      };
      
      const success = CommonService.addToCart(productData);
      if (success) addedCount++;
    });
    
    if (addedCount > 0) {
      console.log(`Added ${addedCount} items to cart`);
      navigation.navigate('Cart');
    }
  };

  const handlePayNow = () => {
    if (!orderData) return;
    setPaymentLoader(true);

    CommonService._callApi({
      api: '/cart/createrarororder',
      method: 'GET',
      urlParams: { order_id: orderData.order_id },
    })
      .then(resp => {
        setPaymentLoader(false);
        if (resp.data.status === 1 && resp.data.response.data.id) {
          const sessionuser = store.getState().GlobalReducer.authuser;
          const options = {
            description: 'Pay for your pharmacy order',
            image: StaticConst.api.endpoint + '/useruploads/site-logo/logo.png',
            currency: 'INR',
            key: resp.data.response.data.RazorpayKey,
            amount: orderData.final_amount,
            name: 'Order - ' + orderData.order_id,
            order_id: resp.data.response.data.id,
            prefill: {
              email: sessionuser?.member_email || '',
              contact: sessionuser?.member_phone || '',
              name: sessionuser?.member_name || '',
            },
            theme: { color: '#2CB7DF' },
          };

          RazorpayCheckout.open(options)
            .then(data => {
              if (data?.razorpay_order_id) {
                setPaymentLoader(true);
                const body = JSON.stringify({
                  razorpay_order_id: data.razorpay_order_id,
                  razorpay_payment_id: data.razorpay_payment_id,
                  razorpay_signature: data.razorpay_signature,
                });
                CommonService._callApi({
                  api: '/cart/verifypayment',
                  method: 'POST',
                  body: body,
                })
                  .then(resp => resp.json())
                  .then(rzrresp => {
                    setPaymentLoader(false);
                    if (rzrresp.status === 1) {
                      console.log('Payment successful');
                      loadOrderDetails(orderData.order_id);
                    } else {
                      console.log('Payment verification failed');
                    }
                  })
                  .catch(() => {
                    setPaymentLoader(false);
                    console.log('Payment verification error');
                  });
              } else {
                console.log('Razorpay order creation failed');
              }
            })
            .catch(() => {
              setPaymentLoader(false);
              console.log('Razorpay payment failed');
            });
        }
      })
      .catch(err => {
        setPaymentLoader(false);
        console.log('Failed to create Razorpay order:', err);
      });
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
            itemCount={`${orderData.items?.length || orderData.products?.length || orderData.total_items || 0} items ordered`}
            images={orderData.items || orderData.products || []}
            totalAmount={orderData.final_amount || orderData.net_amount || '0'}
            onPressItems={() => {}}
            onPayNow={canShowPayNow(orderData) ? handlePayNow : null}
            showPayNow={canShowPayNow(orderData)}
          />

          <OrderTimelineCard
            statusdetails={orderData.statusdetails}
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
            deliverTo={formatAddress(orderData.shipping_address || orderData.address)}
            placedDate={formatDate(orderData.order_date, true)}
          />  

          <YouMayAlsoLike
            products={recommendedProducts}
            onArrowPress={() => console.log('Arrow pressed')}
            onProductPress={(product) => {
              console.log(`Product ${product.product_id} pressed`);
              navigation.navigate('ProductDetails', { id: product.product_id });
            }}
            onAddPress={(product) => {
              console.log(`Add product ${product.product_id} pressed`);
              const productData = {
                product_id: product.product_id,
                product_name: product.product_name || product.title,
                product_sell_price: product.product_sell_price || product.price || product.sell_price,
                product_mrp: product.product_mrp || product.mrp,
                qty: product.qty || 1,
                cartqty: 1,
                discount: product.discount || '',
                unit: product.unit || '',
                image: product.image,
              };
              CommonService.addToCart(productData);
            }}
          />
        </ScrollView>
      )}

      {orderData && (
        <RepeatOrderButton
          label="Repeat Order"
          onPress={handleRepeatOrder}
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
