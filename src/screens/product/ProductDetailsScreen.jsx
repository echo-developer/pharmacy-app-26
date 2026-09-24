import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import ProductDetailsHeader from '../../components/product/ProductDetailsHeader';
import ProductSummaryBar from '../../components/product/ProductSummaryBar';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfoCard from '../../components/product/ProductInfoCard';
import ProductTabs from '../../components/product/ProductTabs';
import ProductDescription from '../../components/product/ProductDescription';
import RelatedProducts from '../../components/product/RelatedProducts';
import ProductPaymentSection from '../../components/product/ProductPaymentSection';
import ProductBottomBar from '../../components/product/ProductBottomBar';

const ProductDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ===== HEADER ===== */}
      <ProductDetailsHeader
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search')}
        onSharePress={() => console.log('Share')}
        onCartPress={() => console.log('Cart')}
      />

      {/* ===== SCROLLABLE CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
        <ProductDescription />
        <RelatedProducts
          onArrowPress={() => console.log('Arrow')}
          onProductPress={(item) => console.log('Product:', item.title)}
          onAddPress={(item) => console.log('Add:', item.title)}
        />
        <ProductPaymentSection />
      </ScrollView>

      {/* ===== STICKY BOTTOM BAR ===== */}
      <ProductBottomBar
        onAddToCart={() => console.log('Add to Cart')}
        onBuyNow={() => console.log('Buy Now')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,       // Bottom bar ke upar thora space
  },
});

export default ProductDetailsScreen;