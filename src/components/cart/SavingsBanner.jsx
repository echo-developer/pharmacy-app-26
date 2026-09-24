import React from 'react';
import { Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SavingsBanner = ({ amount = '₹456' }) => {
  return (
    <LinearGradient
      colors={['#FFFAAE', '#E1F5C4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      locations={[0, 1]}
      style={styles.banner}
    >
      <Text style={styles.text}>
        Yay! You saved <Text style={styles.bold}>{amount}</Text> on this order
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  text: {
    fontSize: 12,
    color: '#263077',             
    fontWeight: '500',
  },
  bold: {
    fontWeight: '800',
    color: '#263077',             
  },
});

export default SavingsBanner;