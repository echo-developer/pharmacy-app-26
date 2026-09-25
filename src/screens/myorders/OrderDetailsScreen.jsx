import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import OrderDetailsHeader from '../../components/orderdetails/OrderDetailsHeader';
import OrderArrivingBanner from '../../components/orderdetails/OrderArrivingBanner';
import OrderItemsStrip from '../../components/orderdetails/OrderItemsStrip';
import OrderTimelineCard from '../../components/orderdetails/OrderTimelineCard';
import OrderBillDetails from '../../components/orderdetails/OrderBillDetails';
import OrderInfoCard from '../../components/orderdetails/OrderInfoCard';
import YouMayAlsoLike from '../../components/orderdetails/YouMayAlsoLike';
import RepeatOrderButton from '../../components/orderdetails/RepeatOrderButton';

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
        <OrderInfoCard
          orderId="ORD123456789"
          payment="Cash on Delivery"
          deliverTo="Tower 48, Tower 48B, Floor 21, Sector 62, Noida, Uttar Pradesh 201301, India"
          placedDate="21 Jun 2026 10:05 AM"
        />  
        <YouMayAlsoLike
          onArrowPress={() => console.log('Arrow pressed')}
          onProductPress={(productId) => console.log(`Product ${productId} pressed`)}
          onAddPress={(productId) => console.log(`Add product ${productId} pressed`)}
        />
      </ScrollView>
       <RepeatOrderButton
          label="Repeat Order"
          onPress={() => console.log('Repeat order pressed')}
        />
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