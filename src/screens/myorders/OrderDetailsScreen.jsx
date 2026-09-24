import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import OrderDetailsHeader from '../../components/orderdetails/OrderDetailsHeader';
import OrderArrivingBanner from '../../components/orderdetails/OrderArrivingBanner';
import OrderItemsStrip from '../../components/orderdetails/OrderItemsStrip';
import OrderTimelineCard from '../../components/orderdetails/OrderTimelineCard';
import OrderBillDetails from '../../components/orderdetails/OrderBillDetails';

const OrderDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <OrderDetailsHeader
        title="Order Details"
        helpLabel="Help"
        onBackPress={() => navigation.goBack()}
        onHelpPress={() => console.log('Help pressed')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <OrderArrivingBanner />
        <OrderItemsStrip />
        <OrderTimelineCard
         onSeeAllUpdates={() => console.log('See all updates')}
        />
        <OrderBillDetails
          itemsTotal="456"
          itemsCutPrice="456"
          deliveryCharge="FREE"
          handlingCharge="456"
          grandTotal="456"
          onDownloadInvoice={() => console.log('Download invoice pressed')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',        
  },
  scrollContent: {
    paddingBottom: 100,                 
  },
});

export default OrderDetailsScreen;