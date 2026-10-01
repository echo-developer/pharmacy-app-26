import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Gift, Share2 } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';

const ReferralScreen = ({ navigation }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CommonService._callApi({ api: '/member/coupon', method: 'GET' })
      .then(response => {
        const data = response.data?.response?.data;
        setCoupons(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  const share = async item => {
    const code = item.coupon_code || item.code || item.referral_code;
    if (!code) {
      Alert.alert(
        'Referral code unavailable',
        'No shareable referral code is linked to this account yet.',
      );
      return;
    }
    try {
      await Share.share({
        message: `Join me on Pharmacy App for medicines and wellness essentials. Use my referral code ${code}.`,
      });
    } catch (_) {
      // The share sheet can be dismissed without completing a share.
    }
  };

  const renderReward = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rewardInfo}>
        <Text style={styles.reward}>
          {item.coupon_name || item.title || 'Referral reward'}
        </Text>
        <Text style={styles.code}>
          {item.coupon_code || item.code || item.referral_code || 'Code unavailable'}
        </Text>
        <Text style={styles.detail}>
          {item.description || item.coupon_description || ''}
        </Text>
      </View>
      <TouchableOpacity style={styles.share} onPress={() => share(item)}>
        <Share2 size={16} color="#fff" />
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={styles.title}>Referral program</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.icon}>
          <Gift size={30} color="#263077" />
        </View>
        <Text style={styles.heroTitle}>Share care. Earn rewards.</Text>
        <Text style={styles.heroSub}>
          Invite friends to discover trusted medicines and wellness products.
          Available referral rewards from your account are listed below.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color="#263077"
          size="large"
        />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item, index) =>
            String(item.id || item.coupon_id || index)
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              There are no referral rewards available right now.
            </Text>
          }
          renderItem={renderReward}
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
  },
  back: { padding: 6, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#18204F' },
  hero: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#E9ECFA',
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#18204F',
    marginTop: 13,
  },
  heroSub: {
    fontSize: 13,
    color: '#646A80',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7,
  },
  loader: { marginTop: 30 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEEF4',
  },
  rewardInfo: { flex: 1 },
  reward: { fontSize: 15, fontWeight: '700', color: '#252A44' },
  code: { fontSize: 14, fontWeight: '700', color: '#263077', marginTop: 5 },
  detail: { fontSize: 12, color: '#787D8F', marginTop: 4 },
  share: {
    backgroundColor: '#263077',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  shareText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  empty: { textAlign: 'center', color: '#777D8F', marginTop: 26, fontSize: 14 },
});

export default ReferralScreen;
