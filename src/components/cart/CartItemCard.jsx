import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  showDashedBorder = true,
}) => {
  return (
    <View style={[styles.card, showDashedBorder && styles.cardDashed]}>
      <View style={styles.row}>
        {/* ===== LEFT: Image (Full Bleed) ===== */}
        <View style={styles.imageBox}>
          <Image
            source={item.image || require('../../assets/images/Subtract.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* ===== CENTER: Details ===== */}
        <View style={styles.centerCol}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.pack}>{item.pack}</Text>
        </View>

        {/* ===== RIGHT: Qty + Price ===== */}
        <View style={styles.rightCol}>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={onDecrease}
              activeOpacity={0.85}
            >
              <Minus size={14} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={onIncrease}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.cutPrice}>₹{item.cutPrice}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  cardDashed: {
    borderBottomWidth: 1,
    borderBottomColor: '#CDDEE4',
    borderStyle: 'dashed',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* ===== Image ===== */
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CDDEE4',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    overflow: 'hidden',           // <-- Image clip
  },
  image: {
    width: '100%',                // <-- Full width
    height: '100%',               // <-- Full height
  },

  /* ===== Center ===== */
  centerCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B1F22',
    lineHeight: 17,
  },
  pack: {
    fontSize: 11,
    color: '#787C77',
    marginTop: 6,
  },

  /* ===== Right ===== */
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB7DF',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    minWidth: 16,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B1F22',
  },
  cutPrice: {
    fontSize: 11,
    color: '#CDDEE4',
    textDecorationLine: 'line-through',
  },
});

export default CartItemCard;