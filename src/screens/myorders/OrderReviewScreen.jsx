import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Star } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';

const ratingValue = value => {
  if (value && typeof value === 'object') return Number(value.rate ?? value.rating) || 0;
  return Number(value) || 0;
};

const OrderReviewScreen = ({ route, navigation }) => {
  const orderId = route.params?.id || route.params?.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [overall, setOverall] = useState(0);
  const [comment, setComment] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let active = true;
    const loadReview = async () => {
      try {
        const [detailsResponse, reviewResponse] = await Promise.all([
          CommonService._callApi({
            api: '/orders/details',
            method: 'GET',
            urlParams: { order_id: orderId },
          }),
          CommonService._callApi({
            api: '/orders/review',
            method: 'GET',
            urlParams: { order_id: orderId },
          }),
        ]);

        const detailsBody = detailsResponse.data;
        const reviewBody = reviewResponse.data;
        const orderData = detailsBody?.response?.data;
        if (!orderData) throw new Error('Order not found');
        if (reviewBody?.status !== 1) throw new Error(reviewBody?.response?.message || 'Unable to load review');

        const reviewData = reviewBody?.response?.data || {};
        const overallData = reviewData.overall;
        const existingReviews = Array.isArray(reviewData.items) ? reviewData.items : [];
        if (!active) return;

        setOrder(orderData);
        setOverall(ratingValue(overallData));
        setComment(typeof overallData === 'object' && overallData ? (overallData.comment || '') : '');
        setItems((orderData.items || orderData.products || []).map(product => {
          const existing = existingReviews.find(review =>
            String(review.product_id) === String(product.product_id)
          );
          return {
            product_id: product.product_id,
            product_name: product.product_name || product.name || 'Medicine',
            rate: ratingValue(existing),
            comment: existing?.comment || '',
          };
        }));
      } catch (error) {
        if (active) Alert.alert('Unable to load review', error.message || 'Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadReview();
    return () => { active = false; };
  }, [orderId]);

  const updateItem = (index, key, value) => {
    setItems(previous => previous.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    ));
  };

  const submit = async () => {
    if (!overall) {
      Alert.alert('Rating required', 'Choose an overall rating before submitting.');
      return;
    }
    setSaving(true);
    const reviewPayload = {
      order_id: order?.order_id || orderId,
      overall_rate: overall,
      overall_comment: comment,
      product_rates: items.map(item => ({
        product_id: item.product_id,
        rate: item.rate,
        comment: item.comment,
      })),
    };
    try {
      const body = await CommonService._callApi({
        api: '/orders/save_review',
        method: 'POST',
        body: JSON.stringify(reviewPayload),
      }).then(response => response.json());
      if (body.status !== 1 || body.response?.data?.status === 0) {
        throw new Error(body.response?.data?.message || body.response?.message || 'Could not submit your review.');
      }
      Alert.alert('Thank you', 'Your review has been submitted.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Could not submit review', error.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const stars = (value, setValue) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(number => (
        <TouchableOpacity key={number} onPress={() => setValue(number)}>
          <Star
            size={28}
            color={number <= value ? '#F4B400' : '#C8CBD6'}
            fill={number <= value ? '#F4B400' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <ArrowLeft size={22} color="#263077" />
        </TouchableOpacity>
        <Text style={styles.title}>Rate your order</Text>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#263077" /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.caption}>Order #{order?.order_number || order?.order_id || orderId}</Text>
          <View style={styles.card}>
            <Text style={styles.section}>Overall experience</Text>
            {stars(overall, setOverall)}
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience (optional)"
              multiline
            />
          </View>
          {items.map((item, index) => (
            <View key={`${item.product_id || index}`} style={styles.card}>
              <Text style={styles.section}>{item.product_name}</Text>
              {stars(item.rate, value => updateItem(index, 'rate', value))}
              <TextInput
                style={styles.input}
                value={item.comment}
                onChangeText={value => updateItem(index, 'comment', value)}
                placeholder="Review this item (optional)"
                multiline
              />
            </View>
          ))}
          <TouchableOpacity style={styles.submit} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit review</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ECEEF4' },
  back: { padding: 6, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#18204F' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  caption: { color: '#6B7082', fontSize: 13, marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 13, marginBottom: 12, borderWidth: 1, borderColor: '#ECEEF4' },
  section: { fontSize: 15, fontWeight: '700', color: '#292D45' },
  stars: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 12 },
  input: { minHeight: 54, borderWidth: 1, borderColor: '#E4E6EE', borderRadius: 9, padding: 11, color: '#292D45', textAlignVertical: 'top' },
  submit: { backgroundColor: '#263077', alignItems: 'center', padding: 15, borderRadius: 10, marginTop: 6 },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default OrderReviewScreen;
