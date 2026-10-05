import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Bell, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonService from '../../utils/CommonService';

const NotificationPreferencesScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    Promise.allSettled([
      CommonService._callApi({
        api: '/member/my_notifications',
        method: 'GET',
        urlParams: { page: 1 },
      }),
      CommonService._callApi({
        api: '/member/unread_notifications',
        method: 'GET',
      }),
    ])
      .then(([listResult, unreadResult]) => {
        const listData = listResult.status === 'fulfilled'
          ? listResult.value.data?.response?.data
          : [];
        const unreadData = unreadResult.status === 'fulfilled'
          ? unreadResult.value.data?.response?.data
          : null;
        setItems(Array.isArray(listData) ? listData : []);
        setUnreadCount(Number(unreadData?.count || 0));
      })
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const openNotification = async item => {
    const notificationId = item.notification_id || item.id;
    const orderId = item.order_id;
    if (notificationId && Number(item.is_read || item.read_status || 0) !== 1) {
      try {
        const response = await CommonService._callApi({
          api: '/notification/seen',
          method: 'POST',
          urlParams: { notification_id: notificationId },
        }).then(r => r.json());
        if (response.status === 1) {
          setItems(current => current.map(notification =>
            String(notification.notification_id || notification.id) === String(notificationId)
              ? { ...notification, is_read: 1, read_status: 1 }
              : notification,
          ));
          setUnreadCount(count => Math.max(0, count - 1));
        }
      } catch (error) {
        console.log('Error marking notification as seen:', error?.message);
      }
    }
    if (orderId) navigation.navigate('OrderDetails', { id: orderId });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => openNotification(item)}
    >
      <View
        style={[
          styles.dot,
          Number(item.is_read || item.read_status) === 1 && styles.read,
        ]}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>
          {item.title || item.notification_title || item.subject || 'Pharmacy update'}
        </Text>
        <Text style={styles.message}>
          {item.message || item.notification_message || item.description || ''}
        </Text>
        <Text style={styles.date}>{item.created_at || item.reg_date || ''}</Text>
      </View>
      <ChevronRight size={18} color="#9298A5" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <ArrowLeft size={22} color="#263077" />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.unread}>{unreadCount} unread</Text>}
        </View>
      </View>

      <View style={styles.info}>
        <Bell size={20} color="#263077" />
        <Text style={styles.infoText}>
          Order and account updates sent to your device appear here.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#263077" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            String(item.notification_id || item.id || index)
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Bell size={34} color="#9298B5" />
              <Text style={styles.emptyTitle}>You’re all caught up</Text>
              <Text style={styles.emptySub}>
                New order and account updates will show here.
              </Text>
            </View>
          }
          renderItem={renderNotification}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F7F8FC' },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ECEEF4',
  },
  back: { padding: 6, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#18204F' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  unread: { fontSize: 11, fontWeight: '700', color: '#263077', backgroundColor: '#EEF0FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  info: {
    margin: 14,
    padding: 13,
    backgroundColor: '#EEF0FA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: { flex: 1, color: '#555C78', fontSize: 13, lineHeight: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 14, paddingBottom: 20, flexGrow: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#263077' },
  read: { backgroundColor: '#D2D5E0' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#272B43' },
  message: { fontSize: 13, color: '#656B7D', lineHeight: 18, marginTop: 4 },
  date: { fontSize: 11, color: '#9296A5', marginTop: 6 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    minHeight: 280,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#252A44', marginTop: 14 },
  emptySub: { fontSize: 13, color: '#7B7F90', textAlign: 'center', marginTop: 6 },
});

export default NotificationPreferencesScreen;
