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
import store from '../../store/store';

// Helper date formatting function replacing moment
const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const ordinal = day % 100 >= 11 && day % 100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th');

  if (options.shortDate) {
    return `${day}${ordinal} ${month}`;
  }
  return `${day}${ordinal} ${month} ${year}`;
};

const orderKey = order => {
  const id = order.order_id || order.id || order.order_number;
  return id == null || id === '' ? null : String(id);
};

const mergeUniqueOrders = orders => {
  const seen = new Set();
  return orders.filter(order => {
    const key = orderKey(order);
    if (key == null) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const MyOrdersScreen = ({ navigation }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const filteredOrders = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return allOrders;
    const q = searchQuery.toLowerCase().trim();
    return allOrders.filter(order => {
      const orderIdMatch = String(order.order_id || order.id || order.order_number || '').toLowerCase().includes(q);
      const statusMatch = String(order.order_status || order.status || '').toLowerCase().includes(q);
      const amountMatch = String(order.order_total ?? order.final_amount ?? order.total_amount ?? order.amount ?? order.grand_total ?? '').includes(q);
      const dateMatch = String(order.order_date_formatted || order.order_date || '').toLowerCase().includes(q);

      const items = order.products || order.items || [];
      const itemMatch = Array.isArray(items) && items.some(item => {
        if (typeof item === 'string') return item.toLowerCase().includes(q);
        if (typeof item === 'object' && item !== null) {
          const name = item.product_name || item.name || item.title || '';
          return String(name).toLowerCase().includes(q);
        }
        return false;
      });

      return orderIdMatch || statusMatch || amountMatch || dateMatch || itemMatch;
    });
  }, [allOrders, searchQuery]);

  const loadOrder = useCallback(async (page = 1, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (page < 2) {
      setLoader(true);
    } else {
      setInfiniteLoader(true);
    }

    let localOrders = [];
    try {
      if (page === 1) localOrders = await CommonService.getLocalOrders();
      const resp = await CommonService._callApi({
        // The backend's app order-list endpoint is /api/app/orders/list.
        api: '/orders/list',
        method: 'GET',
        urlParams: { page, status: '' },
      });
      const dataRes = resp.data;
      let serverOrders = [];
      if (dataRes.status === 1 && dataRes.response) {
        serverOrders = Array.isArray(dataRes.response.data)
          ? dataRes.response.data
          : Array.isArray(dataRes.response)
            ? dataRes.response
            : [];
        const totalPages = parseInt(dataRes.response.total_page || dataRes.response.total_pages, 10) || 1;
        const fetchedPage = parseInt(dataRes.response.current_page, 10) || page;
        currentPageRef.current = fetchedPage;
        hasMoreRef.current = fetchedPage < totalPages;
      } else {
        hasMoreRef.current = false;
      }

      // Prefer the server copy when a locally saved order has synced.
      const combined = page === 1 ? mergeUniqueOrders([...serverOrders, ...localOrders]) : serverOrders;
      const mapped = combined.map((order, index) => ({
        ...order,
        _uniqueKey: orderKey(order) || `order_${page}_${index}`,
        order_date_formatted: formatDate(order.order_date),
      }));
      setAllOrders(prev => append ? mergeUniqueOrders([...prev, ...mapped]) : mapped);
    } catch (err) {
      console.log('ORDER API ERROR:', err?.message || err);
      hasMoreRef.current = false;
      if (page === 1) {
        const mapped = mergeUniqueOrders(localOrders).map((order, index) => ({
          ...order,
          _uniqueKey: orderKey(order) || `local_${index}`,
          order_date_formatted: formatDate(order.order_date),
        }));
        setAllOrders(mapped);
      }
    } finally {
      setLoader(false);
      setRefreshing(false);
      setInfiniteLoader(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const focusSub = navigation.addListener('focus', () => {
      if (!store.getState().GlobalReducer.authuser) {
        navigation.navigate('Login', {
          returnTo: { name: 'Main', params: { screen: 'My Orders' } },
        });
        return;
      }
      currentPageRef.current = 1;
      hasMoreRef.current = true;
      isFetchingRef.current = false;
      loadOrder(1, false);
    });
    return focusSub;
  }, [navigation, loadOrder]);

  const onRefresh = () => {
    if (isFetchingRef.current) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    currentPageRef.current = 1;
    hasMoreRef.current = true;
    loadOrder(1, false);
  };

  const getCardStatus = (statusStr) => {
    // 1: Placed, 2: Shipped, 3: Out for Delivery, 4: Delivered, 7: Cancelled
    const status = String(statusStr || '').toLowerCase();
    if (status === '7' || status.includes('cancel')) return 'cancelled';
    if (status === '4' || status.includes('delivered') || status === 'completed') return 'completed';
    return 'ontime';
  };

  const getStatusLabel = statusStr => {
    const status = String(statusStr || '').toLowerCase();
    if (status === '3' || status.includes('out for delivery')) return 'OUT FOR DELIVERY';
    if (status === '1' || status.includes('place') || status.includes('confirm')) return 'PLACED';
    if (status === '2' || status.includes('ship')) return 'SHIPPED';
    if (status === '4' || status.includes('delivered') || status === 'completed') return 'DELIVERED';
    if (status === '7' || status.includes('cancel')) return 'CANCELLED';
    return 'IN PROGRESS';
  };

  const getHeaderText = (item) => {
    const status = getCardStatus(item.order_status_name || item.status_label || item.order_status || item.status);
    const deliveredDate = item.delivered_date || item.delivered_at;
    const cancelledDate = item.cancelled_date || item.cancelled_at;
    const expectedDate = item.expected_delivery_date || item.delivery_date || item.estimated_delivery_date;
    if (status === 'completed') return deliveredDate ? `Delivered on ${formatDate(deliveredDate, { shortDate: true })}` : 'Delivered';
    if (status === 'cancelled') return cancelledDate ? `Cancelled on ${formatDate(cancelledDate, { shortDate: true })}` : 'Cancelled';
    return expectedDate ? `Arriving by ${formatDate(expectedDate, { shortDate: true })}` : 'Order in progress';
  };

  const getTimelineSteps = item => {
    const labelStatus = item.order_status_name || item.status_label;
    const rawStatus = String(labelStatus || item.order_status || item.status || '').toLowerCase();
    const statusCode = parseInt(rawStatus, 10);
    const isCancelled = statusCode === 7 || rawStatus.includes('cancel');
    const isShipped = [2, 3, 4].includes(statusCode)
      || rawStatus.includes('ship')
      || rawStatus.includes('out for delivery')
      || rawStatus.includes('delivered');
    const isDelivered = statusCode === 4 || rawStatus.includes('delivered') || rawStatus === 'completed';
    return [
      { label: 'Placed', isCompleted: true },
      { label: 'Shipped', isCompleted: !isCancelled && isShipped },
      { label: 'Delivered', isCompleted: !isCancelled && isDelivered },
    ];
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <OrderHistoryHeader
        title="Order History"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => setIsSearching(true)}
        isSearching={isSearching}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onCloseSearch={() => {
          setIsSearching(false);
          setSearchQuery('');
        }}
      />

      {loader ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0D7998" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={300}
          onScroll={({ nativeEvent }) => {
            const nearBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y
              >= nativeEvent.contentSize.height - 160;
            if (nearBottom && hasMoreRef.current && !isFetchingRef.current) {
              loadOrder(currentPageRef.current + 1, true);
            }
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D7998']} />
          }
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? `No orders matching "${searchQuery}"` : 'No orders found'}
              </Text>
            </View>
          ) : (
            filteredOrders.map((item, idx) => {
              const itemStatus = item.order_status_name || item.status_label || item.order_status || item.status;
              const status = getCardStatus(itemStatus);
              const headerText = getHeaderText(item);
              // New API returns gallery as URL strings; older responses return item objects.
              const imagesList = Array.isArray(item.gallery) && item.gallery.length
                ? item.gallery.map(image => typeof image === 'string' ? { image } : image)
                : (item.products || item.items || []).filter(p => p && typeof p === 'object');

              return (
                <TouchableOpacity
                  key={item._uniqueKey || item.order_id || idx.toString()}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('OrderDetails', { id: item.order_id, oid: item.order_id })}
                >
                  <View style={styles.dateLabelWrapper}>
                    <Text style={styles.dateLabel}>
                      Ordered on {formatDate(item.order_date)}
                    </Text>
                  </View>

                  <OrderCard
                    status={status}
                    statusLabel={item.status_label || item.order_status_name || getStatusLabel(itemStatus)}
                    headerText={headerText}
                    orderId={item.order_number || item.order_id}
                    amount={item.order_total ?? item.final_amount ?? item.total_amount ?? item.grand_total ?? item.amount}
                    images={imagesList}
                    onPress={() => navigation.navigate('OrderDetails', { id: item.order_id, oid: item.order_id })}
                    timelineSteps={getTimelineSteps(item)}
                    actions={
                      status === 'ontime'
                        ? [
                          {
                            label: 'Track Order',
                            onPress: () =>
                              navigation.navigate('OrderDetails', { id: item.order_id, oid: item.order_id }),
                          },
                        ]
                        : status === 'completed'
                          ? [
                            {
                              label: 'View Details',
                              onPress: () =>
                                navigation.navigate('OrderDetails', { id: item.order_id, oid: item.order_id }),
                            },
                          ]
                          : [
                            {
                              label: 'View Details',
                              onPress: () =>
                                navigation.navigate('OrderDetails', { id: item.order_id, oid: item.order_id }),
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
