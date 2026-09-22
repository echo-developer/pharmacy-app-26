import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header onCartPress={() => navigation.navigate('Cart')} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header ke turant neeche SearchBar */}
        <SearchBar />

        <PrescriptionBanner
          onUploadPress={() => console.log('Upload pressed')}
          onWhatsAppPress={() => console.log('WhatsApp pressed')}
          onCallPress={() => console.log('Call pressed')}
        />
        
        <OfferCarousel onCardPress={(item) => console.log('Card pressed:', item.category)} />
        <TrustBadges />
        <HealthConcernHeader
          onArrowPress={() => console.log('Arrow pressed')}
        />
        <ConcernPills onPillPress={(item) => console.log('Pill pressed:', item.label)} />
        <HealthConcernList onCardPress={(item) => console.log('Health concern card pressed:', item.label)} />
        <VitaminsHeader
          subtitle="Nourish their growth with"
          title="Vitamins & Supplements"
        />
        <VitaminsProducts onCardPress={(item) => console.log('Vitamins product card pressed:', item.label)} />
        <DealsHeader
          title="Deals you'll love"
          subtitle="Buy now to get the best deals"
          onArrowPress={() => console.log('Deals arrow pressed')}
        />  
        <DealsProducts
          onAddPress={(item) => console.log('Add pressed for product:', item.title)}
          onQtyChange={(id, newQty) => console.log(`Quantity changed for product ID ${id}: ${newQty}`)}
        />
        <PetCareHeader
          title="Pet Care Top Brands"
          subtitle="Everyday care for a healthier you"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;