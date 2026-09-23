import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import CategoryHeader from '../../components/categories/CategoryHeader';
import CategoriesSidebar from '../../components/categories/CategoriesSidebar';

const CategoriesScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <CategoryHeader
        title="Pet Supplements"
        cartCount={2}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => console.log('Search')}
        onCartPress={() => console.log('Cart')}
      />

      <View style={styles.body}>
        <CategoriesSidebar
          style={styles.sidebar}
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />
        {/* Right content area baad me aayega */}
        <View style={styles.contentArea} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1, flexDirection: 'row' },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF' },
  sidebar: { width: 80, maxWidth: 80, flexGrow: 0, flexShrink: 0 },
});

export default CategoriesScreen;