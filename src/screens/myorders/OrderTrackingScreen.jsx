import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BottomSheetModal from '../../components/orderdetails/BottomSheetModal';
import OrderTrackingTimeline from '../../components/orderdetails/OrderTrackingTimeline';

const OrderTrackingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <BottomSheetModal visible={true} onClose={() => navigation.goBack()}>
        <OrderTrackingTimeline />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default OrderTrackingScreen;