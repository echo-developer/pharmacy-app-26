import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header 
        onCartPress={() => navigation.navigate('Cart')} 
      />
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