import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const DeliveryTimeRow = ({ time = '30 mins' }) => {
  return (
    <View style={styles.row}>
      {/* Gradient Icon Circle */}
      <LinearGradient
        colors={['#E8F4FA', '#A2D0E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 1]}
        style={styles.iconCircle}
      >
        <Zap size={14} color="#46758D" fill="#46758D" />
      </LinearGradient>

      {/* Text */}
      <Text style={styles.text}>
        Delivering in <Text style={styles.bold}>{time}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    color: '#4D6979',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '800',
    color: '#007B9F',
  },
});

export default DeliveryTimeRow;