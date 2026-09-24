import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const OrderItemsStrip = ({
  itemCount = '15 items ordered',
  images = [1, 2, 3, 4],
  totalAmount = '456',
  onPressItems,
  onPayNow,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== Top Row: Items Count + Chevron Tab ===== */}
      <TouchableOpacity
        style={styles.topRow}
        onPress={onPressItems}
        activeOpacity={0.85}
      >
        <Text style={styles.itemCount}>{itemCount}</Text>

        <View style={styles.chevronTab}>
          <ChevronRight size={16} color="#787C77" />
        </View>
      </TouchableOpacity>

      {/* ===== Middle Row: Image Thumbnails ===== */}
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

      {/* ===== Bottom Row: Amount + Pay Now ===== */}
      <View style={styles.bottomRow}>
        <Text style={styles.amount}>₹{totalAmount}</Text>

        <TouchableOpacity
          style={styles.payNowBtn}
          onPress={onPayNow}
          activeOpacity={0.85}
        >
          <Text style={styles.payNowText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',         // Screen bg — no white card
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },

  /* ===== Top Row ===== */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263077',                 // 15 items ordered
  },
  chevronTab: {
    width: 36,
    height: 36,
    borderRadius: 10,                  // Rounded square tab
    borderWidth: 1,
    borderColor: '#E4E3E2',           // Chevron tab border
    backgroundColor: '#FFFFFF',        // White bg
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== Images Row ===== */
  imagesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  imageBox: {
    width: 62,
    height: 62,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E3E2',           // Image tab border
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  /* ===== Bottom Row ===== */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263077',                 // ₹456
  },
  payNowBtn: {
    backgroundColor: '#2CB7DF',       // Pay Now bg
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  payNowText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default OrderItemsStrip;