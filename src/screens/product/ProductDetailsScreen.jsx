import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
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

  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  const checkDeliveryAvailability = () => {
    const currentCity = store.getState().GlobalReducer.chosencity;
    const pincode = currentCity?.tempaddress?.postalcode;
    const place_id = currentCity?.tempaddress?.place_id;

    if (!pincode) {
      Alert.alert(
        'Location Not Set',
        'Please select a delivery location first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Select Location', onPress: () => navigation.navigate('MyAddress') }
        ]
      );
      return;
    }

    setCheckingDelivery(true);
    const targetProduct = productData || previewProduct;
    const cartItems = targetProduct ? [{
      product_id: targetProduct.product_id || targetProduct.id,
      cartqty: 1,
      price: targetProduct.product_sell_price || targetProduct.price || 0,
      mrp: targetProduct.product_mrp || targetProduct.mrp || 0,
    }] : [];

    const inputdata = new FormData();
    inputdata.append('pincode', pincode);
    inputdata.append('address_id', place_id || '');
    inputdata.append('cartdata', JSON.stringify(cartItems));
    inputdata.append('member_id', store.getState().GlobalReducer.authuser?.member_id || '');

    CommonService._callApi({
      api: '/cart/check',
      method: 'CONVERT',
      body: inputdata,
    })
      .then(response => response.json())
      .then(resp => {
        setCheckingDelivery(false);
        if (resp.status == 1) {
          const msg = resp.response?.delivery_msg || `Deliverable to ${pincode} in 30 mins`;
          setDeliveryStatus(msg);
          Alert.alert('Delivery Available', msg);
        } else {
          const errMsg = resp.description || resp.message || `Delivery not available at ${pincode}`;
          setDeliveryStatus(errMsg);
          Alert.alert('Delivery Status', errMsg);
        }
      })
      .catch((err) => {
        setCheckingDelivery(false);
        const fallbackMsg = `Deliverable to ${pincode}`;
        setDeliveryStatus(fallbackMsg);
        Alert.alert('Delivery Check', fallbackMsg);
      });
  };

  const currentAddress = store.getState().GlobalReducer.chosencity?.tempaddress?.address || '';

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
            product={productData ? {
              ...productData,
              currentAddress,
              deliveryStatus: checkingDelivery ? 'Checking availability...' : deliveryStatus,
            } : null}
            onLocationPress={() => navigation.navigate('MyAddress')}
            onDeliveryPress={checkDeliveryAvailability}
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