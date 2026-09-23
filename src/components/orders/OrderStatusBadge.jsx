import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STATUS_CONFIG = {
  ontime: {
    label: 'ON TIME',
    backgroundColor: '#0D7998',
    textColor: '#FFFFFF',
  },
  completed: {
    label: 'COMPLETED',
    backgroundColor: '#34C759',
    textColor: '#FFFFFF',
  },
  cancelled: {
    label: 'CANCELLED',
    backgroundColor: '#FF383C',
    textColor: '#FFFFFF',
  },
};

const OrderStatusBadge = ({ status = 'ontime', label }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ontime;

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.textColor }]}>
        {label || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,          // Fully rounded pill (both sides)
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

export default OrderStatusBadge;