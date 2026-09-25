import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import OrderHistoryHeader from '../../components/orders/OrderHistoryHeader';
import OrderCard from '../../components/orders/OrderCard';
import CommonService from '../../utils/CommonService';

// Helper date formatting function replacing moment
const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (options.shortDate) {
    return `${day}th ${month}`;
  }
  return `${day}th ${month} ${year}`;
};

const addDaysToDate = (dateString, days) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  date.setDate(date.getDate() + days);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()}th ${monthNames[date.getMonth()]}`;
};

const MyOrdersScreen = ({ navigation }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);

  const currentPageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const loadOrder = useCallback(async (page = 1, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (page < 2) {
      setLoader(true);
    } else {
      setInfiniteLoader(true);
    }

    const localOrders = await CommonService.getLocalOrders();
    console.log('LOCAL ORDERS:', localOrders.length, JSON.stringify(localOrders[0]));

    CommonService._callApi({
      api: '/order/list',
      method: 'GET',
      urlParams: { page: page, status: '' },
    })
      .then(resp => {
        const dataRes = resp.data;
        console.log('ORDER LIST RAW RESPONSE:', JSON.stringify(dataRes));
        setLoader(false);
        setRefreshing(false);
        setInfiniteLoader(false);
        isFetchingRef.current = false;

        let serverOrders = [];
        if (dataRes.status === 1 && dataRes.response) {
          // Handle both array directly and nested .data
          const rawData = Array.isArray(dataRes.response.data)
            ? dataRes.response.data
            : Array.isArray(dataRes.response)
              ? dataRes.response
              : [];
          console.log('PARSED SERVER ORDERS:', rawData.length, JSON.stringify(rawData[0]));
          serverOrders = rawData;
          const totalPages = parseInt(dataRes.response.total_page, 10) || 1;
          const fetchedPage = parseInt(dataRes.response.current_page, 10) || page;
          currentPageRef.current = fetchedPage;
          hasMoreRef.current = fetchedPage < totalPages;
        } else {
          console.log('ORDER API status not 1 or no response. status:', dataRes.status);
          hasMoreRef.current = false;
        }

        const combined = page === 1 ? [...localOrders, ...serverOrders] : serverOrders;
        console.log('COMBINED ORDERS:', combined.length);
        const mapped = combined.map(o => ({
          ...o,
          order_date_formatted: formatDate(o.order_date),
        }));
        console.log('MAPPED ORDERS:', mapped.length);
        if (append) {
          setAllOrders(prev => [...prev, ...mapped]);
        } else {
          setAllOrders(mapped);
        }
      })
      .catch(err => {
        console.log('ORDER API ERROR:', err?.message || err);
        setLoader(false);
        setRefreshing(false);
        setInfiniteLoader(false);
        isFetchingRef.current = false;
        const mapped = localOrders.map(o => ({
          ...o,
          order_date_formatted: formatDate(o.order_date),
        }));
        setAllOrders(mapped);
      });
  }, []);

  useEffect(() => {
    const focusSub = navigation.addListener('focus', () => {
      currentPageRef.current = 1;
      hasMoreRef.current = true;
      isFetchingRef.current = false;
      loadOrder(1, false);
    });
    return focusSub;
  }, [navigation, loadOrder]);

  const onRefresh = () => {
    setRefreshing(true);
    currentPageRef.current = 1;
    hasMoreRef.current = true;
    loadOrder(1, false);
  };

  const getCardStatus = (statusStr) => {
    // 1: Placed, 2: Shipped, 3: Out for Delivery, 4: Delivered, 7: Cancelled
    if (statusStr === '7' || statusStr === 'Cancelled') return 'cancelled';
    if (statusStr === '4' || statusStr === 'Delivered') return 'completed';
    return 'ontime';
  };

  const getHeaderText = (item) => {
    const status = getCardStatus(item.order_status);
    if (status === 'completed') return `Delivered on ${formatDate(item.order_date, { shortDate: true })}`;
    if (status === 'cancelled') return `Cancelled on ${formatDate(item.order_date, { shortDate: true })}`;
    return `Arriving by ${addDaysToDate(item.order_date, 3)}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <OrderHistoryHeader
        title="Order History"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => { }}
      />

      {loader ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0D7998" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D7998']} />
          }
        >
          {allOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          ) : (
            allOrders.map((item, idx) => {
              const status = getCardStatus(item.order_status);
              const headerText = getHeaderText(item);
              // products/items can be array of objects (with image) or just numbers
              const imagesList = (item.products || item.items || []).filter(
                p => p && typeof p === 'object'
              );

              return (
                <TouchableOpacity
                  key={item.order_id || idx.toString()}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
                >
                  <View style={styles.dateLabelWrapper}>
                    <Text style={styles.dateLabel}>
                      Ordered on {formatDate(item.order_date)}
                    </Text>
                  </View>

                  <OrderCard
                    status={status}
                    headerText={headerText}
                    images={imagesList}
                    onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
                    timelineSteps={[
                      { label: 'Placed', isCompleted: true },
                      { label: 'Shipped', isCompleted: status === 'completed' || status === 'ontime' },
                      { label: 'Delivered', isCompleted: status === 'completed' },
                    ]}
                    actions={
                      status === 'ontime'
                        ? [
                          {
                            label: 'Track Order',
                            onPress: () =>
                              navigation.navigate('OrderDetails', { orderId: item.order_id }),
                          },
                        ]
                        : status === 'completed'
                          ? [
                            {
                              label: 'View Details',
                              onPress: () =>
                                navigation.navigate('OrderDetails', { orderId: item.order_id }),
                            },
                          ]
                          : [
                            {
                              label: 'View Details',
                              onPress: () =>
                                navigation.navigate('OrderDetails', { orderId: item.order_id }),
                            },
                          ]
                    }
                  />
                </TouchableOpacity>
              );
            })
          )}
          {infiniteLoader && (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color="#0D7998" />
            </View>
          )}
        </ScrollView>
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#787887',
  },
  dateLabelWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  dateLabel: {
    fontSize: 12,
    color: '#787887',
    backgroundColor: '#E7E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default MyOrdersScreen;
