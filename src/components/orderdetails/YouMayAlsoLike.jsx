import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ChevronRight, Star, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

const PRODUCTS = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/products.png'),
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/deals.png'),
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet dolor sit...',
    tablets: '60 tablets',
    mrp: '4599',
    price: '1949',
    discount: '58%',
    delivery: 'Get in 30 mins',
    rating: '4.3',
    ratingCount: '10',
    image: require('../../assets/images/Subtract.png'),
  },
];

const YouMayAlsoLike = ({ onArrowPress, onProductPress, onAddPress }) => {
  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>You may also like</Text>
          <Text style={styles.subtitle}>Buy now to get the best deals</Text>
        </View>

        <TouchableOpacity
          style={styles.arrowPill}
          onPress={onArrowPress}
          activeOpacity={0.85}
        >
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* ===== PRODUCT CARDS ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PRODUCTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => onProductPress?.(item)}
          >
            {/* Image Area with Rating Pill */}
            <View style={styles.imageArea}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.ratingPill}>
                <Star size={10} color="#FF8D28" fill="#FF8D28" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.ratingCount})
                </Text>
              </View>
            </View>

            {/* Details */}
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.tablets}>{item.tablets}</Text>
            <Text style={styles.mrp}>MRP ₹{item.mrp}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>~₹{item.price}</Text>
              <Text style={styles.discount}>{item.discount}</Text>
            </View>

            <View style={styles.deliveryRow}>
              <Text style={styles.delivery}>{item.delivery}</Text>
              <View style={styles.zapCircle}>
                <Zap size={10} color="#043250" fill="#043250" />
              </View>
            </View>

            {/* ADD Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAddPress?.(item)}
              activeOpacity={0.85}
            >
              <Text style={styles.addText}>ADD</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 12,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#043250',
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',
    marginTop: 4,
  },
  arrowPill: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0F848B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== Cards ===== */
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  imageArea: {
    width: '100%',
    height: 110,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  ratingPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0E1442',
    marginLeft: 3,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#043250',
    lineHeight: 16,
  },
  tablets: {
    fontSize: 10,
    color: '#787887',
    marginTop: 4,
  },
  mrp: {
    fontSize: 10,
    color: '#949494',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E1442',
  },
  discount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6565',
    marginLeft: 6,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  delivery: {
    fontSize: 10,
    color: '#787887',
    marginRight: 4,
  },
  zapCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E8F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: 10,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#263077',
    letterSpacing: 0.5,
  },
});

export default YouMayAlsoLike;