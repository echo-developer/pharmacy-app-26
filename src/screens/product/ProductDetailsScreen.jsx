import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import ProductDetailsHeader from '../../components/product/ProductDetailsHeader';

const ProductDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ProductDetailsHeader
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search')}
        onSharePress={() => console.log('Share')}
        onCartPress={() => console.log('Cart')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default ProductDetailsScreen;