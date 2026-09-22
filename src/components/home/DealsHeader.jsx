import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const DealsHeader = ({
  title = "Deals you'll love",
  subtitle = 'Buy now to get the best deals',
  onArrowPress,
}) => {
  return (
    <View style={styles.container}>
      {/* LEFT SIDE: Title + Subtitle */}
      <View style={styles.textColumn}>
        <Text style={styles.title}>
          {title} <Text style={styles.heart}>❤️</Text>
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* RIGHT SIDE: Arrow Pill */}
      <TouchableOpacity style={styles.arrowPill} onPress={onArrowPress}>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#043250',          // Title color
  },
  heart: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',          // Subtitle color
    marginTop: 4,
  },
  arrowPill: {
    width: 50,
    height: 32,
    borderRadius: 16,          // Pill shape
    backgroundColor: '#0F848B', // Arrow pill background
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DealsHeader;