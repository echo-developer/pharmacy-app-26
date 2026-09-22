import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import PrescriptionBanner from '../../components/home/PrescriptionBanner';

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
        
        {/* Baaki content yahan aayega */}
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