import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, ChevronUp } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const ProductImageGallery = ({
  image,
  onFavPress,
  onExpandPress,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== Image Area ===== */}
      <View style={styles.imageArea}>
        <Image
          source={image || require('../../assets/images/Subtract.png')}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Heart Button (top-right) */}
        <TouchableOpacity
          style={styles.heartCircle}
          activeOpacity={0.85}
          onPress={onFavPress}
        >
          <Heart size={20} color="#263077" />
        </TouchableOpacity>
      </View>

      {/* ===== Wave + Chevron ===== */}
      <View style={styles.waveChevronContainer}>
        {/* SVG Wave Shape */}
        <Svg
          width="100%"
          height={54}
          viewBox="0 0 414 54"
          preserveAspectRatio="none"
          style={styles.waveSvg}
        >
          <Path
            d="M0,54 C80,54 150,8 207,8 C264,8 334,54 414,54 Z"
            fill="#FFFFFF"
          />
        </Svg>

        {/* Chevron sits on top of the wave peak */}
        <TouchableOpacity
          style={styles.chevronWrapper}
          activeOpacity={0.7}
          onPress={onExpandPress}
        >
          <ChevronUp size={22} color="#263077" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },

  /* ===== Image Area ===== */
  imageArea: {
    width: '100%',
    height: 380,
    backgroundColor: '#B86E62',       // Tab background
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  /* ===== Heart Circle ===== */
  heartCircle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',       // Fill
    borderWidth: 1,
    borderColor: '#CDDEE4',           // Border
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* ===== Wave + Chevron ===== */
  waveChevronContainer: {
    position: 'relative',
    height: 54,
    backgroundColor: '#B86E62',       // matches imageArea background
    marginBottom: 0,
  },
  waveSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  /* ===== Chevron Up ===== */
  chevronWrapper: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductImageGallery;