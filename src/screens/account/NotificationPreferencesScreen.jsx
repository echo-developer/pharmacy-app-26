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
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    CommonService._callApi({
      api: '/member/my_notifications',
      method: 'GET',
      urlParams: { page: 1 },
    })
      .then(response => {
        const list = response.data?.response?.data;
        setItems(Array.isArray(list) ? list : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const openNotification = item => {
    const id = item.order_id || item.template_id;
    if (id) navigation.navigate('OrderDetails', { id });
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
        <Text style={styles.title}>Notifications</Text>
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
