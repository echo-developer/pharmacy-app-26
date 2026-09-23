import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import OrderHistoryHeader from '../../components/orders/OrderHistoryHeader';

const MyOrdersScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <OrderHistoryHeader
        title="Order History"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
});

export default MyOrdersScreen;