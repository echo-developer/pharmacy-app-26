import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import OrderDetailsHeader from '../../components/orderdetails/OrderDetailsHeader';

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