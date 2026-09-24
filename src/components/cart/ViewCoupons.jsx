import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ticket, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ViewCoupons = ({ label = 'View Coupons & Offers', onPress }) => {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#DBE4C8', '#96E6A1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={styles.gradientTab}
      >
        {/* Left: Ticket Icon */}
        <Ticket size={18} color="#FF8D28" />

        {/* Center: Label */}
        <Text style={styles.label}>{label}</Text>

        {/* Right: Chevron */}
        <ChevronRight size={18} color="#333333" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',             
  },
});

export default ViewCoupons;