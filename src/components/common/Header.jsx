import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { ChevronDown, ShoppingBag, MapPin, Navigation } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const Header = ({ 
  userName = "Rubi, Rajdanga", 
  location = "Sector F, South Kolkata", 
  cartCount = 2,
  onLocationPress,
  onCartPress 
}) => {
  return (
    <LinearGradient
      colors={['#E3FCE4', '#FEFCFD']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* LEFT SIDE */}
      <View style={styles.leftContainer}>
        <View style={styles.iconCircle}>
          <Navigation size={18} color="#FFFFFF" fill="#FFFFFF" />
        </View>

        <TouchableOpacity style={styles.textColumn} onPress={onLocationPress}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{userName}</Text>
            <ChevronDown size={16} color="#043250" style={styles.dropdownArrow} />
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={12} color="#787887" style={styles.locationIcon} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* RIGHT SIDE */}
      <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
        <View style={styles.cartIconWrapper}>
          <ShoppingBag size={22} color="#263077" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    // Yahan status bar ki height add karein
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
  },
  // ... baaki styles same rahenge
  leftContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#2CB7DF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  textColumn: { justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: '#043250' },
  dropdownArrow: { marginLeft: 4, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationIcon: { marginRight: 4 },
  locationText: { fontSize: 12, color: '#787887' },
  cartButton: { padding: 4 },
  cartIconWrapper: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#263077',
  },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#709D2A',
    borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});

export default Header;