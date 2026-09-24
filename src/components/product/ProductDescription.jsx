import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductDescription = ({
  title = 'Description',
  description = 'Vitamins and Minerals are essential nutrients that our bodies need for healthy functioning. They perform many crucial functions in our body, right from creating vitality to',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16161D',           
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4F514E',           
    fontWeight: '400',
  },
});

export default ProductDescription;