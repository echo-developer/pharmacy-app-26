import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PetCareHeader = ({
  title = 'Most Popular Brands',
  subtitle = 'Trusted healthcare brands',
}) => {
  return (
    <LinearGradient
      colors={['#E9F6D6', '#E9F6D6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.centerContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#787887',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default PetCareHeader;
