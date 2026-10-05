import React, { useState, useEffect } from 'react';
import { Alert, Linking, NativeModules, Platform, View, ScrollView, StyleSheet, StatusBar, ActivityIndicator, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
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

const getOrderMrpTotal = order => {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (!items.length) return order?.total_mrp ?? order?.order_total ?? 0;
  return items.reduce((total, item) => total + (Number(item.product_mrp) || 0) * (Number(item.product_qty) || 1), 0);
};

const isDeliveredOrder = order => {
  const statusLabel = String(order?.order_status_name || order?.status_label || '').toLowerCase();
  const statusCode = String(order?.order_status || '').toLowerCase();
  return statusCode === '6'
    || statusCode === 'delivered'
    || statusLabel.includes('delivered');
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const orderIdParam = route?.params?.id || route?.params?.oid || route?.params?.orderId || '';
  const [loader, setLoader] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState('');
  const [cancelLoader, setCancelLoader] = useState(false);
  const [returningSubOrderId, setReturningSubOrderId] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

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
      api: '/orders/details',
      method: 'GET',
      urlParams: { order_id: id },
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
      // The app API has no /product/recommended route; use its existing product list.
      api: '/product/list',
      method: 'GET',
      urlParams: {
        category_id: '',
        sub_category_id: '',
        brand_id: '',
        sort_by: 'relevance',
        pincode: '',
      },
    })
      .then(resp => {
        const res = resp.data;
        if (res.status === 1 && res.response) {
          const products = Array.isArray(res.response.data) 
            ? res.response.data 
            : Array.isArray(res.response) 
              ? res.response 
              : [];
          setRecommendedProducts(products.slice(0, 10));
        }
      })
      .catch(err => {
        console.log('Error loading recommended products:', err);
      });
  };

  const getStatusBannerTitle = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === '6' || normalized.includes('delivered') || normalized === 'completed') return 'Order Delivered';
    if (normalized === '7' || normalized.includes('cancel')) return 'Order Cancelled';
    if (normalized === '5' || normalized.includes('out for delivery')) return 'Out for Delivery';
    if (normalized === '4' || normalized.includes('ship')) return 'Order Shipped';
    if (normalized === '3' || normalized.includes('processing')) return 'Order Processing';
    if (normalized === '2' || normalized.includes('confirm')) return 'Order Confirmed';
    if (normalized === '1' || normalized.includes('place')) return 'Order Placed';
    return 'Order Arriving';
  };

  const getStatusBannerMsg = (order) => {
    if (!order) return '';
    const status = String(order.order_status_name || order.status_label || order.order_status || '').toLowerCase();
    const deliveredDate = order.delivered_date || order.delivered_at;
    const cancelledDate = order.cancelled_date || order.cancelled_at;
    const expectedDate = order.expected_delivery_date || order.delivery_date || order.estimated_delivery_date;
    if (status === '6' || status.includes('delivered') || status === 'completed') {
      return deliveredDate ? `Delivered on ${formatDate(deliveredDate, true)}` : 'Your order has been delivered.';
    }
    if (status === '7' || status.includes('cancel')) {
      return cancelledDate ? `Cancelled on ${formatDate(cancelledDate, true)}` : 'This order was cancelled.';
    }
    if (status === '5' || status.includes('out for delivery')) return 'Your order is out for delivery.';
    if (status === '4' || status.includes('ship')) return 'Your order has been shipped.';
    if (status === '3' || status.includes('processing')) return 'Your order is being processed.';
    return expectedDate
      ? `Expected delivery by ${formatDate(expectedDate)}`
      : 'Your order is being processed.';
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
    const statusText = String(order.order_status || '').toLowerCase();
    const status = parseInt(statusText, 10);
    
    // Hide if delivered (4) or cancelled (7)
    if (status === 4 || status === 7 || statusText.includes('delivered') || statusText.includes('cancel')) {
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
        qty: item.product_qty || item.qty || 1,
        cartqty: 1,
        discount: item.discount || '',
        unit: item.unit || item.product_unit || '',
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
            amount: orderData.totals?.final_amount ?? orderData.order_total ?? orderData.final_amount,
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

  const handleDownloadInvoice = async () => {
    const id = orderData?.order_id || orderIdParam;
    if (!id || invoiceLoading) return;
    setInvoiceLoading(true);
    try {
      // This endpoint uses the singular route and the `oid` query parameter.
      const response = await CommonService._callApi({
        api: '/order/details',
        method: 'GET',
        urlParams: { oid: id },
      });
      const body = response.data;
      if (Number(body?.status) !== 1) {
        throw new Error(body?.response?.message || body?.message || 'Could not load the invoice.');
      }
      const invoiceUrl = body.response?.data?.invoice_url;
      if (!invoiceUrl) {
        Alert.alert('Invoice unavailable', 'The invoice is not available for this order yet.');
        return;
      }
      if (Platform.OS === 'android') {
        if (!NativeModules.InvoiceDownload?.downloadInvoice) {
          throw new Error('Direct download is not available in this installed app build. Reinstall the latest Android build and try again.');
        }
        const filename = `Invoice_${orderData?.order_number || id}.pdf`;
        await NativeModules.InvoiceDownload.downloadInvoice(invoiceUrl, filename);
        Alert.alert('Download started', 'Your invoice is downloading. Check the notification or Downloads folder.');
      } else {
        await Linking.openURL(invoiceUrl);
      }
    } catch (error) {
      Alert.alert('Unable to open invoice', error?.message || 'Please try again later.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData?.order_id || cancelLoader) return;
    setCancelLoader(true);
    try {
      const note = cancelNote.trim() || 'Customer requested cancellation';
      const resp = await CommonService._callApi({
        api: '/orders/cancel',
        method: 'POST',
        urlParams: {
          order_id: orderData.order_id,
          // CommonService currently appends query values without encoding.
          note: encodeURIComponent(note),
        },
        body: JSON.stringify({}),
      });
      const result = await resp.json();
      if (result.status === 1 && (result.response?.data?.status === 1 || result.response?.data?.status === '1')) {
        setCancelModalVisible(false);
        setCancelNote('');
        Alert.alert('Order cancelled', result.response?.data?.message || 'Your order has been cancelled.');
        loadOrderDetails(orderData.order_id);
      } else {
        Alert.alert('Cancellation failed', result.response?.data?.message || result.response?.message || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Cancellation failed', 'Unable to cancel this order right now. Please try again.');
    } finally {
      setCancelLoader(false);
    }
  };

  const requestItemReturn = item => {
    Alert.alert(
      'Request return',
      `Request a return for ${item.product_name || 'this item'}?`,
      [
        { text: 'Keep item', style: 'cancel' },
        {
          text: 'Request return',
          onPress: async () => {
            if (!orderData?.order_id || !item?.sub_order_id) return;
            setReturningSubOrderId(item.sub_order_id);
            try {
              const returnForm = new FormData();
              returnForm.append('id', String(orderData.order_id));
              returnForm.append('sub_order_id', String(item.sub_order_id));
              const response = await CommonService._callApi({
                api: '/order/return',
                method: 'CONVERT',
                urlParams: {
                  id: orderData.order_id,
                  sub_order_id: item.sub_order_id,
                },
                body: returnForm,
              }).then(result => result.json());
              const data = response.response?.data;
              if (response.status !== 1 || data?.status === 0 || data?.status === '0') {
                const validationMessage = Array.isArray(response.detail)
                  ? response.detail.map(issue => issue?.msg).filter(Boolean).join(', ')
                  : '';
                const dataMessage = data && !Array.isArray(data) ? data.message : '';
                throw new Error(
                  dataMessage
                  || response.response?.message
                  || response.message
                  || validationMessage
                  || 'Could not request a return.'
                );
              }
              Alert.alert('Return requested', data?.message || response.response?.message || 'Your return request has been submitted.');
              loadOrderDetails(orderData.order_id);
            } catch (error) {
              Alert.alert('Return unavailable', error.message || 'Please try again later.');
            } finally {
              setReturningSubOrderId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <OrderDetailsHeader
        title="Order Details"
        helpLabel="Help"
        onBackPress={() => navigation.goBack()}
        onHelpPress={() => Linking.openURL('https://pharmacy-shop.echodeveloper.com/contact').catch(() => {
          Alert.alert('Unable to open support', 'Please try again later.');
        })}
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
            title={getStatusBannerTitle(orderData.order_status_name || orderData.status_label || orderData.order_status)}
            message={getStatusBannerMsg(orderData)}
          />

          <OrderItemsStrip
            itemCount={`${orderData.items?.length || orderData.products?.length || orderData.total_item || 0} items ordered`}
            images={orderData.items || orderData.products || []}
            totalAmount={orderData.totals?.final_amount ?? orderData.order_total ?? orderData.final_amount ?? orderData.net_amount ?? '0'}
            onPressItems={() => {}}
            onPayNow={canShowPayNow(orderData) ? handlePayNow : null}
            showPayNow={canShowPayNow(orderData)}
          />

          {isDeliveredOrder(orderData)
            && Array.isArray(orderData.items)
            && orderData.items.some(item => item?.sub_order_id != null)
            && (
              <View style={styles.returnCard}>
                <Text style={styles.returnTitle}>Return items</Text>
                {orderData.items.map((item, index) => {
                  const alreadyRequested = item.is_return === 1 || item.is_return === '1' || item.is_return === true;
                  const subOrderId = item.sub_order_id;
                  return (
                    <View key={String(subOrderId || item.product_id || index)} style={styles.returnRow}>
                      <View style={styles.returnItemInfo}>
                        <Text style={styles.returnItemName}>{item.product_name || 'Medicine'}</Text>
                        <Text style={styles.returnItemQty}>Qty: {item.product_qty || 1}</Text>
                      </View>
                      {alreadyRequested ? (
                        <Text style={styles.returnRequested}>{item.return_status || 'Return requested'}</Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.returnAction}
                          onPress={() => requestItemReturn(item)}
                          disabled={!subOrderId || returningSubOrderId === subOrderId}
                        >
                          {returningSubOrderId === subOrderId
                            ? <ActivityIndicator size="small" color="#263077" />
                            : <Text style={styles.returnActionText}>Return</Text>}
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

          {isDeliveredOrder(orderData) && !Number(orderData.is_rated) && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('OrderReview', { id: orderData.order_id || orderIdParam })}
              activeOpacity={0.85}
            >
              <Text style={styles.reviewButtonText}>Rate and review this order</Text>
            </TouchableOpacity>
          )}

          <OrderTimelineCard
            statusdetails={orderData.statusdetails}
            onSeeAllUpdates={() => navigation.navigate('OrderTracking', {
              orderId: orderData.order_id || orderIdParam,
              statusdetails: orderData.statusdetails || [],
            })}
          />

          {(orderData.is_cancel === 1 || orderData.is_cancel === '1' || orderData.is_cancel === true) && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCancelModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>Cancel order</Text>
            </TouchableOpacity>
          )}

          <OrderBillDetails
            itemsTotal={orderData.totals?.cart_total ?? orderData.order_total ?? orderData.total_amount ?? orderData.sub_total ?? '0'}
            itemsCutPrice={getOrderMrpTotal(orderData)}
            deliveryCharge={(orderData.totals?.delivery_charge ?? orderData.shipping_charge ?? 0) > 0 ? `${orderData.totals?.delivery_charge ?? orderData.shipping_charge}` : 'FREE'}
            handlingCharge={orderData.handling_charge ?? '0'}
            taxAmount={orderData.totals?.total_gst}
            grandTotal={orderData.totals?.final_amount ?? orderData.order_total ?? orderData.final_amount ?? orderData.net_amount ?? '0'}
            onDownloadInvoice={handleDownloadInvoice}
            invoiceLoading={invoiceLoading}
          />

          <OrderInfoCard
            orderId={orderData.order_number || orderData.order_id || orderIdParam}
            payment={orderData.payment_mode || (orderData.payment_method === 'RZR' ? 'Razorpay' : orderData.payment_method === 'COD' ? 'Cash on Delivery' : orderData.payment_method) || 'Payment information unavailable'}
            deliverTo={formatAddress(orderData.shipping_address || orderData.address)}
            placedDate={formatDate(orderData.order_date, true)}
          />  

          <YouMayAlsoLike
            products={recommendedProducts}
            onArrowPress={() => navigation.navigate('Products', { title: 'Recommended for you' })}
            onProductPress={(product) => {
              navigation.navigate('ProductDetails', { id: product.product_id });
            }}
            onAddPress={(product) => {
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
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.cancelModal}>
            <Text style={styles.cancelTitle}>Cancel this order?</Text>
            <Text style={styles.cancelDescription}>Tell us why you want to cancel. You can leave this blank.</Text>
            <TextInput
              value={cancelNote}
              onChangeText={setCancelNote}
              placeholder="Cancellation reason"
              style={styles.cancelInput}
              multiline
              maxLength={250}
              editable={!cancelLoader}
            />
            <View style={styles.cancelActions}>
              <TouchableOpacity
                style={[styles.cancelAction, styles.keepOrderAction]}
                onPress={() => setCancelModalVisible(false)}
                disabled={cancelLoader}
              >
                <Text style={styles.keepOrderText}>Keep order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelAction, styles.confirmCancelAction]}
                onPress={handleCancelOrder}
                disabled={cancelLoader}
              >
                {cancelLoader
                  ? <ActivityIndicator size="small" color="#FFFFFF" />
                  : <Text style={styles.confirmCancelText}>Cancel order</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  reviewButton: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#263077',
    alignItems: 'center',
  },
  reviewButtonText: { color: '#263077', fontSize: 14, fontWeight: '700' },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9534F',
    alignItems: 'center',
  },
  cancelButtonText: { color: '#C9302C', fontSize: 14, fontWeight: '700' },
  returnCard: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  returnTitle: { color: '#333333', fontSize: 14, fontWeight: '800', marginBottom: 6 },
  returnRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 8,
  },
  returnItemInfo: { flex: 1, paddingRight: 12 },
  returnItemName: { color: '#333333', fontSize: 13, fontWeight: '600' },
  returnItemQty: { color: '#787887', fontSize: 11, marginTop: 3 },
  returnAction: {
    minWidth: 72,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263077',
    borderRadius: 8,
  },
  returnActionText: { color: '#263077', fontSize: 12, fontWeight: '700' },
  returnRequested: { color: '#787887', fontSize: 12, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  cancelModal: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  cancelTitle: { color: '#263077', fontSize: 18, fontWeight: '700' },
  cancelDescription: { color: '#666666', fontSize: 13, marginTop: 8 },
  cancelInput: {
    minHeight: 82,
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    color: '#333333',
    textAlignVertical: 'top',
  },
  cancelActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelAction: { flex: 1, minHeight: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keepOrderAction: { borderWidth: 1, borderColor: '#263077' },
  keepOrderText: { color: '#263077', fontSize: 13, fontWeight: '700' },
  confirmCancelAction: { backgroundColor: '#C9302C' },
  confirmCancelText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  scrollContent: {
    paddingBottom: 100,                 
  },
});

export default OrderDetailsScreen;
