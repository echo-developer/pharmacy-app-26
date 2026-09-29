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
import { useSelector } from 'react-redux';

const ProductDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const productId = route.params?.id;
  const previewProduct = route.params?.product;

  const [loader, setLoader] = useState(false);
  const [productData, setProductData] = useState(previewProduct || null);

  // Wishlist state
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Cart count from redux for header badge
  const cart = useSelector(state => state.GlobalReducer.cart);
  const cartCount = cart?.items?.length || 0;

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
          const data = dataresp.response.data;
          setProductData(data);
          // Sync favorite state from API response
          setIsFavorite(data?.is_favorite === 1);
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
    } else if (previewProduct) {
      // Sync favorite state from preview product too
      setIsFavorite(previewProduct?.is_favorite === 1);
    }
  }, [productId]);

  const handleFavPress = () => {
    if (!productData?.product_id) return;
    const authuser = store.getState().GlobalReducer.authuser;
    if (!authuser) {
      navigation.navigate('Login');
      return;
    }

    setFavLoading(true);
    const inputparams = new FormData();
    inputparams.append('product_id', productData.product_id);

    CommonService._callApi({
      api: '/member/favorite',
      method: 'CONVERT',
      body: inputparams,
    })
      .then(r => r.json())
      .then(response => {
        setFavLoading(false);
        if (response.status == 1) {
          // Use API response value directly (is_favorite: 1 = added, 0 = removed)
          const newIsFav = response.response?.data?.is_favorite === 1;
          setIsFavorite(newIsFav);
          store.dispatch({
            type: 'SET_FAVORITE_STATUS',
            payload: {
              product_id: productData.product_id,
              is_favorite: newIsFav,
            },
          });
        }
      })
      .catch(() => setFavLoading(false));
  };

  const handleAddToCart = () => {
    // Use productData if available, fallback to previewProduct
    const product = productData || previewProduct;
    if (product) {
      CommonService.addToCart(product);
    }
  };

  const handleBuyNow = () => {
    const product = productData || previewProduct;
    if (product) {
      CommonService.addToCart(product);
      navigation.navigate('Cart');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ProductDetailsHeader
        cartCount={cartCount}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => navigation.navigate('Search')}
        onSharePress={() => console.log('Share')}
        onCartPress={() => navigation.navigate('Cart')}
      />

      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
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
            isFavorite={isFavorite}
            favLoading={favLoading}
            onFavPress={handleFavPress}
            onExpandPress={() => console.log('Expand pressed')}
          />
          <ProductInfoCard
            product={productData}
            onLocationPress={() => navigation.navigate('MyAddress')}
            onDeliveryPress={() => console.log('Delivery pressed')}
            onPackPress={(pack) => {
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
      )}

      {/* Always show bottom bar so Add to Cart / Buy Now are always accessible */}
      <ProductBottomBar
        product={productData || previewProduct}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
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