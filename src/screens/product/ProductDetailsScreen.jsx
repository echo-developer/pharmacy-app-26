import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ProductDetailsHeader from '../../components/product/ProductDetailsHeader';
import ProductSummaryBar from '../../components/product/ProductSummaryBar';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfoCard from '../../components/product/ProductInfoCard';
import ProductTabs from '../../components/product/ProductTabs';
import ProductDescription from '../../components/product/ProductDescription';
import RelatedProducts from '../../components/product/RelatedProducts';
import ProductPaymentSection from '../../components/product/ProductPaymentSection';
import ProductBottomBar from '../../components/product/ProductBottomBar';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const ProductDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const productId = route.params?.id;
  const previewProduct = route.params?.product;

  const [loader, setLoader] = useState(false);
  const [productData, setProductData] = useState(previewProduct || null);

  const getProductDetails = (id) => {
    setLoader(true);
    CommonService._callApi({
      api: '/product/details',
      method: 'GET',
      urlParams: {
        product_id: id,
        pincode: store.getState().GlobalReducer.chosencity?.tempaddress?.postalcode || '',
      },
    })
      .then(dataresp => dataresp.data)
      .then(dataresp => {
        setLoader(false);
        if (dataresp.status == 1) {
          setProductData(dataresp.response.data);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('Product Details API Error:', error);
      });
  };

  useEffect(() => {
    if (productId) {
      getProductDetails(productId);
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (productData) {
      CommonService.addToCart(productData);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate('Cart');
  };

  const cart = store.getState().GlobalReducer.cart;
  const cartCount = cart?.items?.length || 0;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <>
          <ProductDetailsHeader
            cartCount={cartCount}
            onBackPress={() => navigation.goBack()}
            onSearchPress={() => navigation.navigate('Search')}
            onSharePress={() => console.log('Share')}
            onCartPress={() => navigation.navigate('Cart')}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <ProductSummaryBar onPress={() => console.log('Summary pressed')} />
            <ProductImageGallery
              images={
                productData?.gallery?.length
                  ? productData.gallery
                  : productData?.image
                    ? [productData.image]
                    : []
              }
              onFavPress={() => console.log('Favorite pressed')}
              onExpandPress={() => console.log('Expand pressed')}
            />
            <ProductInfoCard
              product={productData}
              onLocationPress={() => navigation.navigate('MyAddress')}
              onDeliveryPress={() => console.log('Delivery pressed')}
              onPackPress={(pack) => {
                // Navigate to the selected pack's product details
                if (pack?.product_id) {
                  navigation.push('ProductDetails', { id: pack.product_id });
                }
              }}
              onAgePress={(age) => console.log('Age selected', age)}
            />
            <ProductTabs onTabPress={(tab) => console.log('Tab selected:', tab)} />
            <ProductDescription description={productData?.product_descriptions || ''} />
            <RelatedProducts
              products={productData?.similar || []}
              onArrowPress={() => navigation.navigate('Products', { title: 'Related Products' })}
              onProductPress={(item) => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
              onAddPress={(item) => CommonService.addToCart(item)}
            />
            <ProductPaymentSection />
          </ScrollView>

          <ProductBottomBar
            product={productData}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default ProductDetailsScreen;