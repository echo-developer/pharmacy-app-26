import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProductSummaryBar = ({
  title = 'Lorem ipsum dolor sit amet sit...',
  price = '1949',
  discount = '58%',
  saveText = 'SAVE EXTRA',
  rating = '4.3',
  ratingCount = '100k',
  onPress,
}) => {
  return (
    <LinearGradient
      colors={['#FCF0E5', '#EFFAFF']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      locations={[0, 1]}
      style={styles.container}
    >
      {/* LEFT: Image */}
      <View style={styles.imageBox}>
        <Image
          source={require('../../assets/images/Subtract.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* CENTER: Title + Price */}
      <View style={styles.centerColumn}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>~₹{price}</Text>
          <Text style={styles.discount}>{discount}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.saveText}>{saveText}</Text>
        </View>
      </View>

      {/* RIGHT: Arrow (UP) + Rating (DOWN) */}
      <View style={styles.rightGroup}>
        {/* Arrow Pill — UPAR */}
        <TouchableOpacity
          style={styles.arrowPill}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>

        {/* Rating — NEECHE */}
        <View style={styles.ratingRow}>
          <LinearGradient
            colors={['#FF512F', '#F09819']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.starWrapper}
          >
            <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.ratingText}>
            {rating} | {ratingCount}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // marginHorizontal: 12,
    marginTop: 8,
    // borderRadius: 10,
    gap: 10,
  },
  imageBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  centerColumn: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#043250',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131A23',
  },
  discount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6565',
    marginLeft: 4,
  },
  separator: {
    fontSize: 11,
    color: '#FF6565',
    marginHorizontal: 3,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6565',
  },
  rightGroup: {
    alignItems: 'center',
    gap: 4,
  },
  arrowPill: {
    width: 34,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C28D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {
    width: 14,
    height: 14,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4D6979',
  },
});

export default ProductSummaryBar;