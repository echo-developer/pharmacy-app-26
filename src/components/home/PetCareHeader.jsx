import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const PawStamp = ({ size, color, opacity = 1, style }) => (
  <View
    pointerEvents="none"
    style={[styles.pawStamp, { width: size, height: size, opacity }, style]}
  >
    <View style={[styles.pawToe, { left: size * 0.08, top: size * 0.25, width: size * 0.2, height: size * 0.25, borderRadius: size * 0.12, backgroundColor: color, transform: [{ rotate: '-24deg' }] }]} />
    <View style={[styles.pawToe, { left: size * 0.29, top: size * 0.07, width: size * 0.2, height: size * 0.25, borderRadius: size * 0.12, backgroundColor: color, transform: [{ rotate: '-8deg' }] }]} />
    <View style={[styles.pawToe, { left: size * 0.53, top: size * 0.07, width: size * 0.2, height: size * 0.25, borderRadius: size * 0.12, backgroundColor: color, transform: [{ rotate: '8deg' }] }]} />
    <View style={[styles.pawToe, { left: size * 0.74, top: size * 0.25, width: size * 0.2, height: size * 0.25, borderRadius: size * 0.12, backgroundColor: color, transform: [{ rotate: '24deg' }] }]} />
    <View style={[styles.pawPad, { left: size * 0.24, top: size * 0.48, width: size * 0.54, height: size * 0.4, borderRadius: size * 0.22, backgroundColor: color }]} />
  </View>
);

const PetCareHeader = ({
  title = 'Pet Care Top Brands',
  subtitle = 'Everyday care for a healthier you',
}) => (
  <View style={styles.container}>
    <PawStamp size={27} color="#97DF38" style={styles.titlePaw} />
    <MaskedView
      style={styles.titleMask}
      maskElement={
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      }
    >
      <LinearGradient
        colors={['#303627', '#81B534', '#69B503']}
        locations={[0, 0.76, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.title, styles.gradientText]} numberOfLines={1}>{title}</Text>
      </LinearGradient>
    </MaskedView>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  pawStamp: {
    position: 'absolute',
  },
  pawToe: {
    position: 'absolute',
  },
  pawPad: {
    position: 'absolute',
    transform: [{ rotate: '-5deg' }],
  },
  container: {
    height: 148,
    alignSelf: 'stretch',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 13,
  },
  titlePaw: {
    position: 'absolute',
    top: 27,
    zIndex: 3,
  },
  titleMask: {
    alignSelf: 'center',
    marginBottom: 4,
    zIndex: 3,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  gradientText: {
    opacity: 0,
  },
  subtitle: {
    fontSize: 15,
    color: '#787887',
    textAlign: 'center',
    zIndex: 3,
  },
});

export default PetCareHeader;
