import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyOrdersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Orders Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#043250',
  },
});

export default MyOrdersScreen;