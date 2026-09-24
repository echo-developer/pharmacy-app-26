import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft, Search } from 'lucide-react-native';

const CartHeader = ({ title = 'Cart', onBackPress, onSearchPress }) => {
  return (
    <View style={styles.header}>
      {/* LEFT: Back + Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#25485B" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* RIGHT: Search */}
      <TouchableOpacity
        style={styles.searchCircle}
        onPress={onSearchPress}
        activeOpacity={0.7}
      >
        <Search size={20} color="#263077" />
      </TouchableOpacity>
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
    // ❌ No backgroundColor — parent gradient dikhega
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#043250',           // Title color
    letterSpacing: 0.2,
  },
  searchCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',  // Circular white tab
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 4,
    // elevation: 2,
  },
});

export default CartHeader;