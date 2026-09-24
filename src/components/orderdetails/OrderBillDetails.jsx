import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Download } from 'lucide-react-native';

const OrderBillDetails = ({
  itemsTotal = '456',
  itemsCutPrice = '456',
  deliveryCharge = 'FREE',
  handlingCharge = '456',
  grandTotal = '456',
  onDownloadInvoice,
}) => {
  return (
    <View style={styles.card}>
      {/* ===== Title ===== */}
      <Text style={styles.title}>Bill Details</Text>

      {/* ===== Row: Items Total ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Items Total</Text>
        <View style={styles.valueRow}>
          <Text style={styles.cutPrice}>₹{itemsCutPrice}</Text>
          <Text style={styles.price}>₹{itemsTotal}</Text>
        </View>
      </View>

      {/* ===== Row: Delivery Charge ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Charge</Text>
        <Text style={styles.free}>{deliveryCharge}</Text>
      </View>

      {/* ===== Row: Handling Charge ===== */}
      <View style={styles.row}>
        <Text style={styles.label}>Handling Charge</Text>
        <Text style={styles.price}>₹{handlingCharge}</Text>
      </View>

      {/* ===== Divider ===== */}
      <View style={styles.divider} />

      {/* ===== Row: Grand Total ===== */}
      <View style={styles.row}>
        <Text style={styles.grandLabel}>Grand Total</Text>
        <Text style={styles.grandValue}>₹{grandTotal}</Text>
      </View>

      {/* ===== Download Invoice Button ===== */}
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={onDownloadInvoice}
        activeOpacity={0.85}
      >
        <Download size={18} color="#333333" />
        <Text style={styles.downloadText}>Download Invoice</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#787C77',                 // Row label
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cutPrice: {
    fontSize: 11,
    color: '#787C77',                 // Cut price
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333333',                 // Price
  },
  free: {
    fontSize: 12,
    fontWeight: '800',
    color: '#709D2A',                 // FREE
  },

  /* ===== Divider ===== */
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },

  /* ===== Grand Total ===== */
  grandLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
  },
  grandValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
  },

  /* ===== Download Invoice ===== */
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E3E2',           // Borderline
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 14,
    gap: 8,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',                 // Text
  },
});

export default OrderBillDetails;