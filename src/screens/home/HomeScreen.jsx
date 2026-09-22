import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import PrescriptionBanner from '../../components/home/PrescriptionBanner';
import OfferCarousel from '../../components/home/OfferCarousel';
import TrustBadges from '../../components/home/TrustBadges';
import HealthConcernHeader from '../../components/home/HealthConcernHeader';

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