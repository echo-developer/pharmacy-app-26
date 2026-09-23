import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft, Search, Share2, ShoppingBag } from 'lucide-react-native';

const ProductDetailsHeader = ({
  cartCount = 0,
  onBackPress,
  onSearchPress,
  onSharePress,
  onCartPress,
}) => {
  return (
    <View style={styles.header}>
      {/* LEFT: Back Arrow */}
      <TouchableOpacity
        style={styles.iconCircle}
        activeOpacity={0.7}
        onPress={onBackPress}
      >
        <ChevronLeft size={22} color="#043250" />
      </TouchableOpacity>

      {/* RIGHT: Search + Share + Bag */}
      <View style={styles.rightGroup}>
        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={onSearchPress}
        >
          <Search size={20} color="#043250" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={onSharePress}
        >
          <Share2 size={20} color="#043250" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={onCartPress}
        >
          <ShoppingBag size={20} color="#043250" />
          {/* {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )} */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 54,
    paddingBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Subtle shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 4,
    // elevation: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#709D2A',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default ProductDetailsHeader;