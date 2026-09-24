import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import ProductDetailsHeader from '../../components/product/ProductDetailsHeader';
import ProductSummaryBar from '../../components/product/ProductSummaryBar';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfoCard from '../../components/product/ProductInfoCard';
import ProductTabs from '../../components/product/ProductTabs';

const ProductDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ProductDetailsHeader
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search')}
        onSharePress={() => console.log('Share')}
        onCartPress={() => console.log('Cart')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductSummaryBar onPress={() => console.log('Summary pressed')} />
        <ProductImageGallery
          onFavPress={() => console.log('Favorite pressed')}
          onExpandPress={() => console.log('Expand pressed')}
        />
        <ProductInfoCard
          onLocationPress={() => console.log('Location pressed')}
          onDeliveryPress={() => console.log('Delivery pressed')}
          onPackPress={(pack) => console.log('Pack selected', pack)}
          onAgePress={(age) => console.log('Age selected', age)}
        />
        <ProductTabs onTabPress={(tab) => console.log('Tab selected:', tab)} />
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
