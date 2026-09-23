import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Text } from 'react-native';
import OrderHistoryHeader from '../../components/orders/OrderHistoryHeader';
import OrderCard from '../../components/orders/OrderCard';

const MyOrdersScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <OrderHistoryHeader
        title="Order History"
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.dateLabelWrapper}>
          <Text style={styles.dateLabel}>Ordered on 14th June 2026</Text>
        </View>

        {/* On Time Order */}
        <OrderCard
          status="ontime"
          headerText="Arriving by 10th Jun"
          images={[1, 2, 3, 4]}
          timelineSteps={[
            { label: 'Placed', isCompleted: true },
            { label: 'Shipped', isCompleted: false },
            { label: 'Delivered', isCompleted: false },
          ]}
          actions={[
            { label: 'Track Order', onPress: () => console.log('Track') },
            { label: 'Pay Online', onPress: () => console.log('Pay') },
          ]}
        />

        {/* Completed Order */}
        <OrderCard
          status="completed"
          headerText="Delivered on 02th Jun"
          images={[1, 2, 3, 4]}
          timelineSteps={[
            { label: 'Placed', isCompleted: true },
            { label: 'Shipped', isCompleted: true },
            { label: 'Delivered', isCompleted: true },
          ]}
          actions={[
            { label: 'Repeat Order', onPress: () => console.log('Repeat') },
          ]}
        />

        {/* Cancelled Order */}
        <OrderCard
          status="cancelled"
          headerText="Cancelled on 02th Jun"
          images={[1, 2, 3, 4]}
          actions={[
            { label: 'Reorder', onPress: () => console.log('Reorder') },
          ]}
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
  dateLabelWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  dateLabel: {
    fontSize: 12,
    color: '#787887',
    backgroundColor: '#E7E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default MyOrdersScreen;