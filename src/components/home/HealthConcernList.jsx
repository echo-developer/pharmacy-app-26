import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const concerns = [
  {
    id: 1,
    label: 'Allergy',
    image: require('../../assets/images/allergy.png'),
    gradient: ['#DEE9EE', '#FAD1D2'],
  },
  {
    id: 2,
    label: 'Cold & Cough',
    image: require('../../assets/images/cold&cough.png'),
    gradient: ['#DEE9EE', '#D0DEF9'],
  },
  {
    id: 3,
    label: 'Pain Relief',
    image: require('../../assets/images/painrelief.png'),
    gradient: ['#DEE9EE', '#FAD1D2'],
  },
];

const HealthConcernList = ({ onCardPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {concerns.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          style={styles.cardWrapper}
          onPress={() => onCardPress?.(item)}
        >
          {/* Gradient Background (hexagon corners) */}
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBg}
          />

          {/* Image full bleed */}
          <ImageBackground
            source={item.image}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
            resizeMode="cover"
          >
            {/* Label at bottom */}
            <Text style={styles.cardLabel}>{item.label}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    // 3D shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: '#FFF',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    // Hexagon-style cut corners
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    // Same hexagon cuts on image
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#252525',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default HealthConcernList;