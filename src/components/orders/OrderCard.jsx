import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import OrderActions from './OrderActions';

const HEADER_CONFIG = {
  ontime: {
    headerTextColor: '#0D7998',
    chevronColor: '#25485B',
    gradientColors: ['#F6F6F6', '#E4E5EF'],
  },
  completed: {
    headerTextColor: '#34C759',
    chevronColor: '#263077',
    gradientColors: ['#EDF6EF', '#EDF6EF'],
  },
  cancelled: {
    headerTextColor: '#FF383C',
    chevronColor: '#263077',
    gradientColors: ['#F4ECEC', '#F4ECEC'],
  },
};

const OrderCard = ({
  status = 'ontime',
  headerText = 'Arriving by 10th Jun',
  images = [],
  timelineSteps = [],
  actions = [],
  onPress,
}) => {
  const config = HEADER_CONFIG[status] || HEADER_CONFIG.ontime;

  return (
    <View style={styles.card}>
      {/* ===== HEADER with Gradient ===== */}
      <LinearGradient
        colors={config.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.72]}
        style={styles.headerRow}
      >
        <View style={styles.headerLeft}>
          <OrderStatusBadge status={status} />
          <Text style={[styles.headerText, { color: config.headerTextColor }]}>
            {headerText}
          </Text>
        </View>
        <ChevronRight size={20} color={config.chevronColor} />
      </LinearGradient>

      {/* ===== IMAGES ROW ===== */}
      <View style={styles.imagesRow}>
        {images.map((_, index) => (
          <View key={index} style={styles.imageBox}>
            <Image
              source={require('../../assets/images/deals.png')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>

      {/* ===== TIMELINE ===== */}
      {timelineSteps.length > 0 && (
        <View style={styles.timelineWrapper}>
          <OrderTimeline steps={timelineSteps} />
        </View>
      )}

      {/* ===== ACTIONS ===== */}
      {actions.length > 0 && <OrderActions actions={actions} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CDDEE4',
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== Header ===== */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
    flexShrink: 1,
  },

  /* ===== Images Row ===== */
  imagesRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#EBE9E9',
    // alignItems: 'center',
    // justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  /* ===== Timeline ===== */
  timelineWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default OrderCard;