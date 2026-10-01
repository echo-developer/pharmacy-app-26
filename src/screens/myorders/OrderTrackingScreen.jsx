import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BottomSheetModal from '../../components/orderdetails/BottomSheetModal';
import OrderTrackingTimeline from '../../components/orderdetails/OrderTrackingTimeline';

const OrderTrackingScreen = ({ navigation, route }) => {
  const statusdetails = route?.params?.statusdetails || [];
  const orderId = route?.params?.orderId;
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <BottomSheetModal visible={true} onClose={() => navigation.goBack()}>
        <OrderTrackingTimeline statusdetails={statusdetails} orderId={orderId} />
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
