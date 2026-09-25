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
import { ArrowUpRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.52;
const CARD_HEIGHT = 180;
const IMAGE_CARD_HEIGHT = 220;

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
          // Cipla / Sun Pharma — no card, just image with overlays
          if (item.logo) {
            return (
              <TouchableOpacity
                key={itemId}
                activeOpacity={0.9}
                style={styles.imageCard}
                onPress={() => onBrandPress?.(item)}
              >
                <ImageBackground
                  source={item.logo}
                  style={styles.imageBackground}
                  imageStyle={styles.imageStyle}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }

          // Default brand card with name label
          return (
            <TouchableOpacity
              key={itemId}
              activeOpacity={0.9}
              style={styles.card}
              onPress={() => onBrandPress?.(item)}
            >
              {item.available && (
                <View style={styles.availablePill}>
                  <Text style={styles.availableText}>{item.available}</Text>
                </View>
              )}
              <View style={styles.logoContainer}>
                {item.image ? (
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.brandImageBg}
                    imageStyle={styles.brandImageStyle}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.brandNameText}>{item.name || item.brand_name}</Text>
                )}
              </View>
              <View style={styles.arrowButton}>
                <ArrowUpRight size={18} color="#FFFFFF" />
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
  // Image-only card (Cipla / Sun Pharma) — no white background, no shadow
  imageCard: {
    width: CARD_WIDTH,
    height: IMAGE_CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // White card (Abbott)
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Full-cover image for Cipla / Sun Pharma
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 12,
  },
  imageStyle: {
    borderRadius: 16,
  },

  // Abbott logo centered
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
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
