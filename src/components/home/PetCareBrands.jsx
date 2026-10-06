import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CachedImageBackground as ImageBackground } from '../common/CachedImage';
import { ArrowUpRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.52;
const CARD_HEIGHT = 180;
const IMAGE_CARD_HEIGHT = 220;
const noImagePlaceholder = {
  uri: 'https://pharmacy-shop.echodeveloper.com/useruploads/default/no-image-150x150.jpg',
};
const localBrandImages = {
  cipla: require('../../assets/images/cipla.png'),
  'sun pharma': require('../../assets/images/sunpharma.png'),
};

const AbbottLogo = () => (
  <View style={styles.abbottWrapper}>
    <View style={styles.abbottSymbol}>
      <View style={styles.abbottSymbolInner} />
    </View>
    <Text style={styles.abbottText}>Abbott</Text>
  </View>
);

const PetCareBrands = ({ brands = [], onBrandPress }) => {
  return (
    <LinearGradient
      colors={['#E9F6D6', '#E9F6D6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((item) => {
          const itemId = item.id || item.brand_id;
          const bgImage = item.logo || item.image || item.brand_image || item.banner;
          const hasBrandImage = typeof bgImage === 'string'
            ? bgImage.trim() !== '' && !/no-image|placeholder/i.test(bgImage)
            : Boolean(bgImage);
          const brandName = item.name || item.brand_name || '';
          const localBrandImage = localBrandImages[brandName.trim().toLowerCase()];
          const isPlaceholderImage = !hasBrandImage && !localBrandImage;
          const imageSource = hasBrandImage
            ? (typeof bgImage === 'string' ? { uri: bgImage } : bgImage)
            : (localBrandImage || noImagePlaceholder);

          return (
            <TouchableOpacity
              key={itemId}
              activeOpacity={0.9}
              style={styles.imageCard}
              onPress={() => onBrandPress?.(item)}
            >
              <View style={styles.fullCardWrapper}>
                <ImageBackground
                  source={imageSource}
                  style={styles.imageBackground}
                  imageStyle={[styles.imageStyle, isPlaceholderImage && styles.placeholderImageStyle]}
                  resizeMode="cover"
                >
                  {isPlaceholderImage && brandName ? (
                    <Text style={styles.placeholderBrandName} numberOfLines={1}>
                      {brandName}
                    </Text>
                  ) : null}
                </ImageBackground>
                {item.available && (
                  <View style={styles.availablePill}>
                    <Text style={styles.availableText}>{item.available}</Text>
                  </View>
                )}
                <View style={styles.arrowButton}>
                  <ArrowUpRight size={18} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 20,
    paddingTop: 4,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - 32 - CARD_WIDTH) / 2,
    gap: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  imageCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
  },
  fullCardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImageStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  placeholderBrandName: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    right: 48,
    color: '#263077',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  fallbackCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
  },
  brandNameWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  availablePill: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(244, 245, 248, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#263077',
  },

  /* Abbott custom logo */
  abbottWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abbottSymbol: {
    width: 30,
    height: 24,
    borderWidth: 2.5,
    borderColor: '#00A0DF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  abbottSymbolInner: {
    width: 14,
    height: 7,
    borderWidth: 2,
    borderColor: '#00A0DF',
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  abbottText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },

  arrowButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#263077',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImageBg: {
    width: '80%',
    height: 60,
  },
  brandImageStyle: {
    borderRadius: 8,
  },
  brandNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263077',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

export default PetCareBrands;
