import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_WIDTH = (width - 32 - CARD_GAP * 2) / 3;
const CARD_HEIGHT = 126;

const VitaminsProducts = ({ products = [], onCardPress }) => {
  return (
    <View style={styles.grid}>
      {products.map((item, index) => (
        <TouchableOpacity
          key={(item.product_id || item.category_id || item.id || index).toString()}
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => onCardPress?.(item)}
        >
          {/* Gradient Card Background — Top to Bottom */}
          <LinearGradient
            colors={['#FED7D4', '#E0C763']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0.34, 1]}
            style={styles.gradientBg}
          >
            {/* Label (Top) */}
            <Text style={styles.cardLabel}>{item.label || item.category_name || item.product_name}</Text>
          </LinearGradient>

          {/* Image */}
          {item.image && !item.image.includes('via.placeholder') ? (
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/petsupplements.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: CARD_GAP,
    marginTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    borderRadius: 12,
  },
  cardLabel: {
    fontSize: 13,              // Bigger
    fontWeight: '800',         // Bolder
    color: '#693410',
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 15,
  },
  cardImage: {
    position: 'absolute',
    bottom: 0,                 // Touching bottom
    alignSelf: 'center',
    width: '80%',
    height: '65%',
  },
});

export default VitaminsProducts;