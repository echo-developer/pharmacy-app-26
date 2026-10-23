import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Zap } from 'lucide-react-native';

const DeliveryTimeInfo = ({ text, style }) => (
  <View style={[styles.row, style]}>
    <Text style={styles.label}>{text || 'Get in 30 mins'}</Text>
    <LinearGradient
      colors={['#E8F4FA', '#A2D0E8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconCircle}
    >
      <Zap size={10} color="#043250" fill="#043250" />
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  label: { fontSize: 11, color: '#787887' },
  iconCircle: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});

export default DeliveryTimeInfo;
