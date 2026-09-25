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

const defaultAsset = require('../../assets/images/allergy.png');

const getImageSource = (img) => {
  if (!img) return defaultAsset;
  if (typeof img === 'string') return { uri: img };
  return img;
};

const HealthConcernList = ({ concerns = [], onCardPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {concerns.map((item, index) => {
        const itemId = item.category_id || item.id || item.product_id || index;
        const imgSource = getImageSource(item.image);
        return (
          <TouchableOpacity
            key={itemId.toString()}
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => onCardPress?.(item)}
          >
            {/* Gradient Background */}
            <LinearGradient
              colors={item.gradient || ['#E3FCE4', '#FEFCFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBg}
            />

            {/* Image full bleed */}
            <ImageBackground
              source={imgSource}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
              resizeMode="cover"
            >
              {/* Label at bottom */}
              <Text style={styles.cardLabel}>{item.label || item.category_name || item.name || 'Health Concern'}</Text>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
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