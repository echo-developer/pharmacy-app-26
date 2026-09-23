import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react-native';

const CategoryHeader = ({
  title = 'Pet Supplements',
  cartCount = 2,
  onBackPress,
  onSearchPress,
  onCartPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Content Row (icons + title) */}
      <View style={styles.contentRow}>
        {/* LEFT: Back Arrow */}
        <TouchableOpacity style={styles.iconCircle} onPress={onBackPress}>
          <ArrowLeft size={20} color="#333333" />
        </TouchableOpacity>

        {/* CENTER: Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* RIGHT: Search + Bag */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconCircle} onPress={onSearchPress}>
            <Search size={20} color="#263077" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={onCartPress}>
            <ShoppingBag size={20} color="#263077" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F4F5FF',        // Background status bar ke peeche bhi
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44, // StatusBar height
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,                     // Icons thora neeche
    paddingBottom: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#263077',
    marginHorizontal: 12,
  },
  rightIcons: {
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
    borderColor: '#F4F5FF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default CategoryHeader;