import React, { useState, useEffect, useReducer } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
import PetCareHeader from '../../components/home/PetCareHeader';
import PetCareBrands from '../../components/home/PetCareBrands';
import CommonService from '../../utils/CommonService';

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

const defaultBanners = [
  { id: 1, category: 'Up to 50% Off on Medicines', discount: '50% OFF', image: 'https://via.placeholder.com/350x150' },
  { id: 2, category: 'Free Delivery on First Order', discount: 'FREE DELIVERY', image: 'https://via.placeholder.com/350x150' },
];

const defaultHealthConcerns = [
  { id: 1, label: 'Diabetes Care', name: 'Diabetes Care' },
  { id: 2, label: 'Cardiac Care', name: 'Cardiac Care' },
  { id: 3, label: 'Stomach Care', name: 'Stomach Care' },
  { id: 4, label: 'Skin Care', name: 'Skin Care' },
  { id: 5, label: 'Eye Care', name: 'Eye Care' },
  { id: 6, label: 'Bone & Joint', name: 'Bone & Joint' },
];

const defaultVitamins = [
  {
    product_id: 301,
    product_name: 'Revital H Daily Multivitamin',
    product_sell_price: 310,
    product_mrp: 350,
    unit: '30 Capsules',
    image: 'https://via.placeholder.com/150',
  },
  {
    product_id: 302,
    product_name: 'Seven Seas Omega-3 Fish Oil',
    product_sell_price: 499,
    product_mrp: 580,
    unit: '100 Capsules',
    image: 'https://via.placeholder.com/150',
  },
  {
    product_id: 303,
    product_name: 'Limcee Vitamin C 500mg',
    product_sell_price: 105,
    product_mrp: 120,
    unit: '15 Chewable Tablets',
    image: 'https://via.placeholder.com/150',
  },
];

const defaultDeals = [
  {
    product_id: 401,
    product_name: 'Dettol Antiseptic Liquid 500ml',
    product_sell_price: 185,
    product_mrp: 210,
    unit: '500 ml Bottle',
  },
  {
    product_id: 402,
    product_name: 'Volini Pain Relief Spray 100g',
    product_sell_price: 245,
    product_mrp: 299,
    unit: '100g Spray',
  },
  {
    product_id: 403,
    product_name: 'Accu-Chek Active 50 Test Strips',
    product_sell_price: 975,
    product_mrp: 1049,
    unit: '50 Strips Box',
  },
];

const defaultPetCareBrands = [
  { id: 1, name: 'Pedigree' },
  { id: 2, name: 'Whiskas' },
  { id: 3, name: 'Royal Canin' },
  { id: 4, name: 'Drools' },
];

const HomeScreen = ({ navigation }) => {
  const [homeState, dispatch] = useReducer(homeReducer, {
    data: null,
    loader: true,
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

  // API keys: banner, category, popular_category, deals_of_the_day, popular_brand, promo_offer
  const banners = homeState.data?.banner?.length ? homeState.data.banner : defaultBanners;
  const healthConcerns = homeState.data?.category?.length ? homeState.data.category : defaultHealthConcerns;
  // popular_category has { category_id, category_name, image, items[] }
  // flatten all items across popular categories for vitamins section
  const popularCategories = homeState.data?.popular_category || [];
  const vitamins = popularCategories.length
    ? popularCategories.map(cat => ({
      ...cat,
      label: cat.category_name,
      image: cat.image,
      // first product in the category for display
      product_id: cat.items?.[0]?.product_id ?? cat.category_id,
    }))
    : defaultVitamins;
  const deals = homeState.data?.deals_of_the_day?.length ? homeState.data.deals_of_the_day : defaultDeals;
  // popular_brand: { brand_id, brand_name, image }
  const petBrands = homeState.data?.popular_brand?.length
    ? homeState.data.popular_brand.map(b => ({ ...b, id: b.brand_id, name: b.brand_name }))
    : defaultPetCareBrands;

  return (
    <View style={styles.container}>
      <Header
        onLocationPress={() => navigation.navigate('MyAddress')}
        onCartPress={() => navigation.navigate('Cart')}
      />

      {homeState.loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2CB7DF" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <SearchBar onPress={() => navigation.navigate('Search')} />

          <PrescriptionBanner
            onUploadPress={() => navigation.navigate('Products', { title: 'Upload Prescription' })}
            onWhatsAppPress={() => console.log('WhatsApp pressed')}
            onCallPress={() => console.log('Call pressed')}
          />

          <OfferCarousel
            offers={banners}
            onCardPress={(item) => navigation.navigate('Products', { title: item.category_name || item.category || 'Special Offers' })}
          />
          <TrustBadges />
          <HealthConcernHeader
            onArrowPress={() => navigation.navigate('Products', { title: 'Health Concerns' })}
          />
          <ConcernPills
            concerns={healthConcerns}
            onPillPress={(item) => navigation.navigate('Products', { title: item.category_name || item.label || item.name || 'Health Concern' })}
          />
          <HealthConcernList
            concerns={healthConcerns}
            onCardPress={(item) => navigation.navigate('Products', { title: item.category_name || item.label || item.name || 'Health Concern' })}
          />
          <VitaminsHeader
            subtitle="Nourish their growth with"
            title="Vitamins & Supplements"
          />
          <VitaminsProducts
            products={vitamins}
            onCardPress={(item) => navigation.navigate('ProductDetails', { id: item.product_id, product: item })}
          />
          <DealsHeader
            title="Deals you'll love"
            subtitle="Buy now to get the best deals"
            onArrowPress={() => navigation.navigate('Products', { title: "Deals You'll Love" })}
          />
          <DealsProducts
            products={deals}
            onAddPress={handleAddToCart}
            onQtyChange={(id, newQty) => console.log(`Quantity changed for product ID ${id}: ${newQty}`)}
          />
          <View style={styles.petCareSection}>
            <PetCareHeader
              title="Pet Care Top Brands"
              subtitle="Everyday care for a healthier you"
            />
            <PetCareBrands
              brands={petBrands}
              onBrandPress={(item) => navigation.navigate('Products', { title: item.name || 'Pet Care' })}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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