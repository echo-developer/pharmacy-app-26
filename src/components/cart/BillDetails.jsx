import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BillDetails = ({
  itemsTotal = '456',
  itemsCutPrice = '456',
  deliveryCharge = 'FREE',
  handlingCharge = '456',
  grandTotal = '456',
  totalSavings = '456.00',
}) => {
  return (
    <View style={styles.wrapper}>
      {/* ===== White Card ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>Bill Details</Text>

        {/* Items Total */}
        <View style={styles.row}>
          <Text style={styles.label}>Items Total</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cutPrice}>₹{itemsCutPrice}</Text>
            <Text style={styles.price}>₹{itemsTotal}</Text>
          </View>
        </View>

        {/* Delivery Charge */}
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Charge</Text>
          <Text style={styles.free}>{deliveryCharge}</Text>
        </View>

        {/* Handling Charge */}
        <View style={styles.row}>
          <Text style={styles.label}>Handling Charge</Text>
          <Text style={styles.price}>₹{handlingCharge}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Grand Total */}
        <View style={styles.row}>
          <Text style={styles.grandLabel}>Grand Total</Text>
          <Text style={styles.grandValue}>₹{grandTotal}</Text>
        </View>
      </View>

      {/* ===== Savings Strip (with rounded bottom) ===== */}
      <View style={styles.savingsStrip}>
        <Text style={styles.savingsText}>Your total savings</Text>
        <Text style={styles.savingsValue}>₹{totalSavings}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',              // Important — corners clip ho
  },

  /* ===== White Card ===== */
  card: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#787C77',
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cutPrice: {
    fontSize: 11,
    color: '#787C77',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 12,
    fontWeight: '800',
    color: '#263077',
  },
  free: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2CB7DF',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },
  grandLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263077',
  },
  grandValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263077',
  },

  /* ===== Savings Strip ===== */
  savingsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#186379',
    paddingHorizontal: 14,
    paddingVertical: 14,
    // Bottom corners rounded to match the wrapper
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  savingsValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default BillDetails;