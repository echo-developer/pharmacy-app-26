import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryHeader from '../../components/categories/CategoryHeader';

const CategoriesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CategoryHeader
        title="Pet Supplements"
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search pressed')}
        onCartPress={() => console.log('Cart pressed')}
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

export default CategoriesScreen;