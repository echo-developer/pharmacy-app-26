import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PawPrint } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const GradientText = ({ text, style }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={['#69B503', '#81B534', '#303627']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.24, 1]}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const PetCareHeader = ({
  title = 'Pet Care Top Brands',
  subtitle = 'Everyday care for a healthier you',
}) => {
  return (
    <LinearGradient
      colors={['#E9F6D6', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* ===== Top-Left Paw Print Cluster ===== */}
      <View style={styles.pawCluster}>
        <PawPrint
          size={44}
          color="#C9C9A0"
          style={[styles.pawBg, { top: 0, left: 0, opacity: 0.55 }]}
        />
        <PawPrint
          size={30}
          color="#C9C9A0"
          style={[styles.pawBg, { top: 28, left: 38, opacity: 0.5 }]}
        />
        <PawPrint
          size={26}
          color="#C9C9A0"
          style={[styles.pawBg, { top: 55, left: 12, opacity: 0.45 }]}
        />
      </View>

      {/* ===== Center Content ===== */}
      <View style={styles.centerContent}>
        {/* Paw Icon */}
        <PawPrint size={28} color="#69B503" fill="#69B503" />

        {/* Gradient Title */}
        <GradientText text={title} style={styles.title} />

        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  pawCluster: {
    position: 'absolute',
    top: -10,
    left: -15,
    width: 100,
    height: 100,
  },
  pawBg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default PetCareHeader;