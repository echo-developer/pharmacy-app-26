import React, { useEffect, useReducer, useState } from 'react';
import { Alert, View, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { errorCodes, isErrorWithCode, pick, types } from '@react-native-documents/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import PrescriptionBanner from '../../components/home/PrescriptionBanner';
import OfferCarousel from '../../components/home/OfferCarousel';
import HomeHighlights from '../../components/home/HomeHighlights';
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
import { HomeLoadingSkeleton } from '../../components/common/ScreenLoadingSkeletons';

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

const PINNED_SEARCH_BOTTOM_GAP = 12;

const normalizeHomeImage = image => {
  if (typeof image !== 'string' || !image) return image;
  const apiOrigin = StaticConst.api.endpoint.replace(/\/api\/app\/?$/i, '');
  return image.replace(/^http:\/\/localhost:8081(?=\/)/i, apiOrigin);
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [activeHealthCategoryId, setActiveHealthCategoryId] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchHeight, setSearchHeight] = useState(0);
  const [prescriptionHeight, setPrescriptionHeight] = useState(0);
  const [homeState, dispatch] = useReducer(homeReducer, {
    data: null,
    loader: true,
  });
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const pinnedSearchOpacity = scrollY.interpolate({
    inputRange: [0, Math.max(headerHeight, 1)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

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
  const banners = apiBanners.length > 0
    ? apiBanners.map(item => ({ ...item, image: normalizeHomeImage(item.image) }))
    : fallbackBanners;
  const browseCategories = Array.isArray(homeState.data?.category) ? homeState.data.category : [];
  // The backend supplies the Shop by Health Concern cards under
  // browse_health_category, with legacy health_concerns supported as fallback.
  const sourceHealthConcerns = Array.isArray(homeState.data?.browse_health_category)
    ? homeState.data.browse_health_category
    : Array.isArray(homeState.data?.health_concerns)
      ? homeState.data.health_concerns
      : [];
  const healthConcernCategories = sourceHealthConcerns
    .map(item => ({
      ...item,
      id: item.id || item.category_id,
      name: item.category_name || item.name || item.label,
      subcategories: Array.isArray(item.subcategories)
        ? item.subcategories.map(subcategory => ({
          ...subcategory,
          label: subcategory.sub_category_name || subcategory.category_name || subcategory.name,
          image: normalizeHomeImage(subcategory.image),
        }))
        : [],
    }))
    .sort((a, b) => {
      const rank = name => /over-the-counter|\botc\b/i.test(name) ? 0
        : /vitamins?\s*&?\s*supplements/i.test(name) ? 1 : 2;
      return rank(a.name || '') - rank(b.name || '');
    });
  const defaultHealthCategory = healthConcernCategories.find(category =>
    /over-the-counter|\botc\b/i.test(category.name || ''),
  ) || healthConcernCategories[0];
  const selectedHealthCategory = healthConcernCategories.find(category =>
    String(category.id) === String(activeHealthCategoryId),
  ) || defaultHealthCategory;
  const healthConcerns = selectedHealthCategory?.subcategories?.length
    ? selectedHealthCategory.subcategories
    : (sourceHealthConcerns.length === 0 ? fallbackHealthConcerns : []);
  const vitaminBrowseCategory = sourceHealthConcerns.find(category =>
    /vitamins?\s*&?\s*supplements/i.test(category.category_name || category.name || category.label || ''),
  );
  const vitaminSubcategories = Array.isArray(vitaminBrowseCategory?.subcategories)
    ? vitaminBrowseCategory.subcategories.map(item => ({
      ...item,
      name: item.sub_category_name || item.category_name || item.name,
      image: normalizeHomeImage(item.image),
    }))
    : [];
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
  const deals = Array.isArray(homeState.data?.deals_of_the_day) ? homeState.data.deals_of_the_day : [];
  // popular_brand: { brand_id, brand_name, image }
  const popularBrands = Array.isArray(homeState.data?.popular_brand)
    ? homeState.data.popular_brand.map(b => ({ ...b, id: b.brand_id || b.id, name: b.brand_name || b.name }))
    : [];

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
      <Animated.View
        pointerEvents="none"
        style={[
          styles.headerGradientFrame,
          {
            height: insets.top + headerHeight + searchHeight +
              prescriptionHeight + PINNED_SEARCH_BOTTOM_GAP,
            opacity: pinnedSearchOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={['#E3FCE4', '#FEFCFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1, marginTop: insets.top, zIndex: 0, elevation: 0 }}
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
          <HomeLoadingSkeleton />
        ) : (
          <View style={styles.homeSections}>
            <View onLayout={event => {
              const measuredHeight = event.nativeEvent.layout.height;
              setPrescriptionHeight(current => current || measuredHeight);
            }}><PrescriptionBanner
                onUploadPress={handlePrescriptionUpload}
                uploading={uploadingPrescription}
              /></View>
            {banners.length > 0 && <View><OfferCarousel
              offers={banners}
              showCaption={false}
              showPagination={false}
              fullWidth
              onCardPress={(item) => navigation.navigate('Products', {
                title: item.category_name || item.category || 'Special Offers',
                category_id: item.category_id || item.id,
              })}
            /></View>}
            <LinearGradient
              colors={['#FEFCFD', '#E9F6FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.highlightsAndTrustBackground}
            >
              <HomeHighlights
                categories={popularCategories}
                onProductPress={item => navigation.navigate('ProductDetails', {
                  id: item.product_id,
                  product: item,
                })}
              />
              <TrustBadges />
            </LinearGradient>
            {healthConcerns.length > 0 && <View>
              <HealthConcernHeader
                onArrowPress={() => navigation.navigate('Categories')}
              />
              <ConcernPills
                concerns={healthConcernCategories}
                onPillPress={item => setActiveHealthCategoryId(item.id || item.category_id)}
              />
              <HealthConcernList
                concerns={healthConcerns}
                onCardPress={item => navigation.navigate('Products', {
                  title: item.label || item.name || 'Health Concern',
                  category_id: selectedHealthCategory?.id,
                  sub_category_id: item.sub_category_id || item.id,
                })}
              />
            </View>}
            {vitaminSubcategories.length > 0 && <View style={{ marginTop: -20 }}>
              <VitaminsHeader
                subtitle="Nourish their growth with"
                title="Vitamins & Supplements"
              />
              <VitaminsProducts
                products={vitaminSubcategories}
                onCardPress={item => navigation.navigate('Products', {
                  title: item.name || 'Vitamins & Supplements',
                  category_id: vitaminBrowseCategory.id || vitaminBrowseCategory.category_id,
                  sub_category_id: item.sub_category_id || item.id,
                })}
              />
            </View>}
            {browseCategories.length > 0 && <View>
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
            </View>}
            {(popularMedicines.length > 0 || popularCategories.length > 0) && <View>
              <PopularMedicineSection
                popularMedicines={popularMedicines}
                categories={popularCategories}
                onAddPress={handleAddToCart}
                onProductPress={(item) => navigation.navigate('ProductDetails', {
                  id: item.product_id,
                  product: item,
                })}
                onArrowPress={() => navigation.navigate('Products', { title: 'Popular Medicines' })}
              />
            </View>}
            {mostOrderedMedicines.length > 0 && <View>
              <DealsHeader
                title="Most Ordered Medicines"
                subtitle="Frequently ordered pharmacy essentials"
                showHeart={false}
                compactArrow
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
            </View>}
            {deals.length > 0 && <View>
              <DealsHeader
                title="Deals you'll love"
                subtitle="Buy now to get the best deals"
                onArrowPress={() => navigation.navigate('Offers')}
              />
              <DealsProducts
                products={deals}
                onAddPress={handleAddToCart}
              /></View>}
            {popularBrands.length > 0 && <LinearGradient
              colors={['#E9F6D6', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.petCareSection}
            >
              <PetCareHeader
                title="Pet Care Top Brands"
                subtitle="Everyday care for a healthier you"
              />
              <PetCareBrands
                brands={popularBrands}
                onBrandPress={(item) => navigation.navigate('Products', {
                  title: item.name || item.brand_name || 'Brand products',
                  brand_id: item.brand_id || item.id,
                })}
              />
            </LinearGradient>}
          </View>
        )}
      </Animated.ScrollView>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pinnedSearchBackground,
          {
            height: insets.top + searchHeight + PINNED_SEARCH_BOTTOM_GAP,
            opacity: pinnedSearchOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#E3FCE4', '#FEFCFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
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
  headerGradientFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  pinnedSearchBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  homeSections: {
    gap: 20,
  },
  floatingSearch: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 110,
    elevation: 110,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  highlightsAndTrustBackground: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  petCareSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default HomeScreen;

