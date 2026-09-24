import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderInfoCard = ({
  orderId = 'ORD123456789',
  payment = 'Cash on Delivery',
  deliverTo = 'Tower 48, Tower 48B, Floor 21, Sector 62, Noida, Uttar Pradesh 201301, India',
  placedDate = '21 Jun 2026 10:05 AM',
}) => {
  return (
    <View style={styles.card}>
      {/* ===== Title ===== */}
      <Text style={styles.title}>Order details</Text>

      {/* ===== Row: Order ID ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{orderId}</Text>
      </View>

      {/* ===== Row: Payment ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Payment</Text>
        <Text style={styles.value}>{payment}</Text>
      </View>

      {/* ===== Row: Deliver to ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Deliver to</Text>
        <Text style={[styles.value, styles.multiline]}>{deliverTo}</Text>
      </View>

      {/* ===== Row: Order Placed ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Order Placed</Text>
        <Text style={styles.value}>{placedDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== Title ===== */
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',                 // Title
    marginBottom: 12,
  },

  /* ===== Row ===== */
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#787C77',                 // Labels
    fontWeight: '500',
    width: 110,                       // Fixed width for alignment
  },
  value: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',                 // Values
    lineHeight: 17,
  },
  multiline: {
    // For longer text like address
  },
});

export default OrderInfoCard;