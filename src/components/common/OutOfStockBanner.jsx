import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const OutOfStockBanner = ({ style, fontSize = 12 }) => (
  <View pointerEvents="none" style={[style, styles.container]}>
    <Svg
      pointerEvents="none"
      width="100%"
      height="100%"
      viewBox="0 0 100 36"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Path d="M0 0 Q50 16 100 0 L100 36 Q50 20 0 36 Z" fill="#838383" />
    </Svg>
    <Text style={[styles.label, { fontSize }]}>Out of Stock</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default OutOfStockBanner;
