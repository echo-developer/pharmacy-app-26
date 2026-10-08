import React, { useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Alert, Linking, View, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { errorCodes, isErrorWithCode, pick, types } from '@react-native-documents/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import PrescriptionBanner from '../../components/home/PrescriptionBanner';
import OfferCarousel from '../../components/home/OfferCarousel';
import TrustBadges from '../../components/home/TrustBadges';
import HealthConcernHeader from '../../components/home/HealthConcernHeader';
import ConcernPills from '../../components/home/ConcernPills';
import HealthConcernList from '../../components/home/HealthConcernList';
import VitaminsHeader from '../../components/home/VitaminsHeader';
import VitaminsProducts from '../../components/home/VitaminsProducts';
import DealsHeader from '../../components/home/DealsHeader';
import DealsProducts from '../../components/home/DealsProducts';
import PopularMedicineSection from '../../components/home/PopularMedicineSection';
import PetCareHeader from '../../components/home/PetCareHeader';
import PetCareBrands from '../../components/home/PetCareBrands';
import CommonService from '../../utils/CommonService';
import StaticConst from '../../utils/StaticConst';
import CartFloatingBar from '../../components/cart/CartFloatingBar';

const homeReducer = (prevState, action) => {
  switch (action.type) {
    case 'SETDATA':
      return {
        ...prevState,
        data: action.token,
      };
    case 'SHOWLOADER':
      return {
        ...prevState,
        loader: action.token,
      };
    case 'HIDELOADER':
      return {
        ...prevState,
        loader: action.token,
      };
    default:
      return prevState;
  }
};

// Keep the previous on-screen content until the corresponding API data is ready.
const fallbackBanners = [
  { id: 1, category: 'Up to 50% Off on Medicines', discount: '50% OFF' },
  { id: 2, category: 'Free Delivery on First Order', discount: 'FREE DELIVERY' },
];

const fallbackHealthConcerns = [
  { id: 1, label: 'Diabetes Care', name: 'Diabetes Care' },
  { id: 2, label: 'Cardiac Care', name: 'Cardiac Care' },
  { id: 3, label: 'Stomach Care', name: 'Stomach Care' },
  { id: 4, label: 'Skin Care', name: 'Skin Care' },
  { id: 5, label: 'Eye Care', name: 'Eye Care' },
  { id: 6, label: 'Bone & Joint', name: 'Bone & Joint' },
];

const normalizeHomeImage = image => {
  if (typeof image !== 'string' || !image) return image;
  const apiOrigin = StaticConst.api.endpoint.replace(/\/api\/app\/?$/i, '');
  return image.replace(/^http:\/\/localhost:8081(?=\/)/i, apiOrigin);
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchHeight, setSearchHeight] = useState(0);
  const [dividerOffset, setDividerOffset] = useState(0);
  const [homeState, dispatch] = useReducer(homeReducer, {
    data: null,
    loader: true,
  });
  const scrollY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = () => {
    dispatch({ type: 'SHOWLOADER', token: true });
    CommonService._callApi({
      api: 'home/list',
      method: 'GET',
      urlParams: {},
    })
      .then(response => {
        // axios returns response.data directly (not response.json())
        const json = response.data;
        dispatch({ type: 'HIDELOADER', token: false });
        if (json.status == 1) {
          dispatch({ type: 'SETDATA', token: json.response.data });
        }
      })
      .catch(error => {
        dispatch({ type: 'HIDELOADER', token: false });
        console.log('Home API Error:', error);
      });
  };

  const handleAddToCart = (product) => {
    CommonService.addToCart(product);
  };

  // API keys include banner, category, popular_category, popular_medicines,
  // most_ordered, deals_of_the_day, popular_brand, and promo_offer.
  const apiBanners = Array.isArray(homeState.data?.banner) ? homeState.data.banner : [];
  const banners = apiBanners.length > 0 ? apiBanners : fallbackBanners;
  const lowerBanners = Array.isArray(homeState.data?.lower_banner)
    ? homeState.data.lower_banner
    : [];
  const browseCategories = Array.isArray(homeState.data?.category) ? homeState.data.category : [];
  // The backend supplies the Shop by Health Concern cards under
  // browse_health_category, with legacy health_concerns supported as fallback.
  const sourceHealthConcerns = Array.isArray(homeState.data?.browse_health_category)
    ? homeState.data.browse_health_category
    : Array.isArray(homeState.data?.health_concerns)
      ? homeState.data.health_concerns
      : [];
  const apiHealthConcerns = sourceHealthConcerns.map(item => ({
    ...item,
    label: item.category_name || item.name || item.label,
    image: normalizeHomeImage(
      item.image || item.subcategories?.find(subcategory => subcategory.image)?.image,
    ),
  }));
  const healthConcerns = apiHealthConcerns.length > 0
    ? apiHealthConcerns
    : fallbackHealthConcerns;
  const popularMedicines = Array.isArray(homeState.data?.popular_medicines)
    ? homeState.data.popular_medicines
    : [];
  const mostOrderedMedicines = Array.isArray(homeState.data?.most_ordered)
    ? homeState.data.most_ordered
    : [];
  // popular_category is the data source for the Popular Medicine category tabs.
  const popularCategories = Array.isArray(homeState.data?.popular_category)
    ? homeState.data.popular_category
    : [];
  const vitaminCategory = popularCategories.find(cat =>
    /vitamins?\s*(?:&|and)?\s*supplements/i.test(cat.category_name || ''),
  );
  const vitamins = Array.isArray(vitaminCategory?.items) ? vitaminCategory.items : [];
  const deals = Array.isArray(homeState.data?.deals_of_the_day) ? homeState.data.deals_of_the_day : [];
  // popular_brand: { brand_id, brand_name, image }
  const popularBrands = Array.isArray(homeState.data?.popular_brand)
    ? homeState.data.popular_brand.map(b => ({ ...b, id: b.brand_id || b.id, name: b.brand_name || b.name }))
    : [];

  const openExternalUrl = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', 'Please try again or contact customer support.');
    }
  };

  const handlePrescriptionUpload = async () => {
    if (uploadingPrescription) return;
    try {
      const [file] = await pick({ type: [types.pdf, types.images] });
      if (!file?.uri) {
        Alert.alert('File unavailable', 'Please choose a prescription file and try again.');
        return;
      }

      setUploadingPrescription(true);
      const form = new FormData();
      form.append('file', {
        uri: file.uri,
        type: file.type || 'application/octet-stream',
        name: file.name || 'prescription',
      });
      form.append('patient_name', '');
      form.append('notes', '');
      form.append('call_before_order', '');
      form.append('pincode', '');

      const response = await CommonService._callApi({
        api: 'prescription/upload',
        method: 'CONVERT',
        body: form,
      }).then(result => result.json());

      const responseData = response.response?.data;
      if (response.status !== 1 || responseData?.status === 0 || responseData?.status === '0') {
        const dataMessage = responseData && !Array.isArray(responseData) ? responseData.message : '';
        throw new Error(dataMessage || response.response?.message || response.message || 'Upload failed. Please try again.');
      }

      Alert.alert('Prescription uploaded', responseData?.message || response.response?.message || 'Your prescription was uploaded successfully.');
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert('Upload failed', error?.message || 'Please try again later.');
    } finally {
      setUploadingPrescription(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <LinearGradient
        colors={['#E3FCE4', '#FEFCFD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          // Keep one uninterrupted gradient through the prescription card's divider.
          height: insets.top + headerHeight + searchHeight + 12 + dividerOffset,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
        pointerEvents="none"
      />
      <Animated.ScrollView
        style={{ flex: 1, marginTop: insets.top }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <Header
          includeSafeAreaTop={false}
          transparentBackground
          onLayout={event => {
            const measuredHeight = event.nativeEvent.layout.height;
            setHeaderHeight(current => current || measuredHeight);
          }}
          onLocationPress={() => navigation.navigate('MyAddress')}
          onCartPress={() => navigation.navigate('Cart')}
        />
        <View style={{ height: searchHeight }} />

      {homeState.loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <View>
          <PrescriptionBanner
            phoneNumber="1800-123-456"
            onUploadPress={handlePrescriptionUpload}
            uploading={uploadingPrescription}
            onWhatsAppPress={() => openExternalUrl('https://wa.me/?text=Hello%2C%20I%20need%20help%20with%20my%20prescription.')}
            onCallPress={() => openExternalUrl('tel:1800123456')}
            onDottedLineLayout={event => {
              const measuredOffset = event.nativeEvent.layout.y;
              setDividerOffset(current => current || measuredOffset);
            }}
          />
          {banners.length > 0 && <OfferCarousel
            offers={banners}
            onCardPress={(item) => navigation.navigate('Products', {
              title: item.category_name || item.category || 'Special Offers',
              category_id: item.category_id || item.id,
            })}
          />}
          {browseCategories.length > 0 && <>
            <HealthConcernHeader
              title="Browse Categories"
              subtitle="Browse medicines by category"
              onArrowPress={() => navigation.navigate('Categories')}
            />
            <ConcernPills
              concerns={browseCategories}
              onPillPress={(item) => navigation.navigate('Products', {
                title: item.category_name || item.label || item.name || 'Products',
                category_id: item.category_id || item.id,
              })}
            />
          </>}
          {(popularMedicines.length > 0 || popularCategories.length > 0) &&
            <PopularMedicineSection
              popularMedicines={popularMedicines}
              categories={popularCategories}
              onAddPress={handleAddToCart}
              onProductPress={(item) => navigation.navigate('ProductDetails', {
                id: item.product_id,
                product: item,
              })}
              onArrowPress={() => navigation.navigate('Products', { title: 'Popular Medicines' })}
            />}
          <TrustBadges />
          {healthConcerns.length > 0 && <>
            <HealthConcernHeader
              onArrowPress={() => navigation.navigate('Categories')}
            />
            <HealthConcernList
              concerns={healthConcerns}
              onCardPress={(item) => navigation.navigate('Products', {
                title: item.category_name || item.label || item.name || 'Health Concern',
                category_id: item.category_id || item.id,
              })}
            />
          </>}
          {mostOrderedMedicines.length > 0 && <>
            <DealsHeader
              title="Most Ordered Medicines"
              subtitle="Frequently ordered pharmacy essentials"
              showHeart={false}
              onArrowPress={() => navigation.navigate('Products', { title: 'Most Ordered Medicines' })}
            />
            <DealsProducts
              products={mostOrderedMedicines}
              onAddPress={handleAddToCart}
              onProductPress={(item) => navigation.navigate('ProductDetails', {
                id: item.product_id,
                product: item,
              })}
            />
          </>}
          {vitamins.length > 0 && <>
            <VitaminsHeader
              subtitle="Nourish their growth with"
              title="Vitamins & Supplements"
            />
            <VitaminsProducts
              products={vitamins}
              onCardPress={(item) => navigation.navigate('ProductDetails', {
                id: item.product_id,
                product: item,
              })}
            />
          </>}
          {deals.length > 0 && <DealsHeader
            title="Deals you'll love"
            subtitle="Buy now to get the best deals"
            onArrowPress={() => navigation.navigate('Offers')}
          />}
          {deals.length > 0 && <DealsProducts
            products={deals}
            onAddPress={handleAddToCart}
          />}
          {lowerBanners.length > 0 && <OfferCarousel
            offers={lowerBanners.map(item => ({
              ...item,
              image: normalizeHomeImage(item.image),
            }))}
            showCaption={false}
            onCardPress={(item) => {
              if (item.category_id) {
                navigation.navigate('Products', {
                  title: item.category_name || 'Products',
                  category_id: item.category_id,
                });
              } else if (item.brand_id) {
                navigation.navigate('Products', {
                  title: item.category_name || 'Brand products',
                  brand_id: item.brand_id,
                });
              }
            }}
          />}
          {popularBrands.length > 0 && <View style={styles.petCareSection}>
            <PetCareHeader
              title="Most Popular Brands"
              subtitle="Trusted healthcare brands"
            />
            <PetCareBrands
              brands={popularBrands}
              onBrandPress={(item) => navigation.navigate('Products', {
                title: item.name || item.brand_name || 'Brand products',
                brand_id: item.brand_id || item.id,
              })}
            />
          </View>}
        </View>
      )}
      </Animated.ScrollView>
      {headerHeight > 0 && (
        <Animated.View
          style={[
            styles.floatingSearch,
            {
              top: insets.top + headerHeight,
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight],
                  outputRange: [0, -headerHeight],
                  extrapolate: 'clamp',
                }),
              }],
            },
          ]}
        >
          <SearchBar
            transparentBackground
            onLayout={event => {
              const measuredHeight = event.nativeEvent.layout.height;
              setSearchHeight(current => current || measuredHeight);
            }}
            onPress={() => navigation.navigate('Search')}
          />
        </Animated.View>
      )}
      <CartFloatingBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingSearch: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petCareSection: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
  },
});

export default HomeScreen;
