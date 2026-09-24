import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderArrivingBanner = ({
  title = 'Order Arriving',
  message = 'Your Order Arriving in 20 mins',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',        
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',   
    left: 20,   
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF8D28',                  
    marginTop: 4,
    left: 20,
  },
});

export default OrderArrivingBanner;