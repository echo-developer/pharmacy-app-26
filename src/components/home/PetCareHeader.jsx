import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PawPrint } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const PetCareHeader = ({
  subtitle = 'Everyday care for a healthier you',
}) => {
  return (
    <LinearGradient
      colors={['#E9F6D6', '#E9F6D6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* ===== Top-Left Decorative Circles ===== */}
      <View style={styles.circleCluster}>
        <View style={[styles.circle, { width: 52, height: 52, top: -8, left: -8, opacity: 0.45 }]} />
        <View style={[styles.circle, { width: 36, height: 36, top: 32, left: 20, opacity: 0.35 }]} />
        <View style={[styles.circle, { width: 24, height: 24, top: 14, left: 50, opacity: 0.3 }]} />
      </View>

      {/* ===== Center Content ===== */}
      <View style={styles.centerContent}>
        {/* Paw Icon */}
        <PawPrint size={30} color="#69B503" fill="#69B503" />

        {/* Title: "Pet Care" dark + "Top Brands" green */}
        <Text style={styles.title}>
          <Text style={styles.titleDark}>Pet Care </Text>
          <Text style={styles.titleGreen}>Top Brands</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  circleCluster: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 90,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#C8C9A2',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  titleDark: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 0.2,
  },
  titleGreen: {
    fontSize: 22,
    fontWeight: '800',
    color: '#69B503',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#787887',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default PetCareHeader;