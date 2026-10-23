import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Heart, Zap, Minus, Plus } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonService from '../../utils/CommonService';
import { isProductOutOfStock } from '../../utils/productAvailability';
import OutOfStockBanner from '../common/OutOfStockBanner';
import { getDiscountLabel } from '../../utils/productPricing';

const CategoryProductCard = ({ product, onProductPress, onAddPress, onFavPress, isFavorite = false }) => {
  const imageUri = typeof product.image === 'string' ? product.image : product.image?.uri;
  const [imageLoaded, setImageLoaded] = React.useState(!imageUri);

  React.useEffect(() => {
    setImageLoaded(!imageUri);
  }, [imageUri]);
  // Read live cart qty from redux
  const cart = useSelector(state => state.GlobalReducer.cart);
  const cartQty = React.useMemo(() => {
    if (!cart?.items || !product?.id) return 0;
    const item = cart.items.find(o => Math.abs(o.product_id) === Math.abs(product.id));
    return item ? item.cartqty : 0;
  }, [cart, product?.id]);
  const outOfStock = isProductOutOfStock(product);
  const discountLabel = getDiscountLabel(product);

  const handleIncrease = () => onAddPress?.();
  const handleDecrease = () => {
    if (product?.id) CommonService.decreaseCart(product.id);
  };

  return (
    <View style={[styles.card, outOfStock && { opacity: 0.62 }]}>
      {/* ===== TOP: Image + Details ===== */}
      <TouchableOpacity style={styles.topRow} activeOpacity={0.85} onPress={onProductPress}>
        {/* Image Area */}
        <View style={styles.imageArea}>
          {product.discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.discount}</Text>
            </View>
          )}
          {!imageLoaded && <View pointerEvents="none" style={styles.imageSkeleton} />}
          <FastImage
            source={imageUri ? { uri: imageUri, priority: FastImage.priority.normal } : require('../../assets/images/products.png')}
            style={[styles.image, !imageLoaded && styles.imagePending]}
            resizeMode={FastImage.resizeMode.contain}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          {outOfStock && <OutOfStockBanner style={styles.outOfStockBanner} />}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.tablets}>{product.tablets}</Text>
          {Number(product.mrp) > Number(product.price) && (
            <Text style={styles.mrp}>MRP <Text style={styles.mrpAmount}>₹{product.mrp}</Text></Text>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.price}>~₹{product.price}</Text>
            {discountLabel ? <Text style={styles.discountPct}>{discountLabel}</Text> : null}
          </View>
          <View style={styles.deliveryRow}>
            <Text style={styles.delivery}>{product.delivery}</Text>
            <LinearGradient
              colors={['#E8F4FA', '#A2D0E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zapCircle}
            >
              <Zap size={10} color="#043250" fill="#043250" />
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>

      {/* ===== BOTTOM: Heart + ADD / Stepper ===== */}
      <View style={styles.bottomRow}>
        {/* Heart button */}
        <TouchableOpacity style={styles.iconBox} onPress={onFavPress}>
          <Heart
            size={18}
            color={isFavorite ? '#ff0000' : '#263077'}
            fill={isFavorite ? '#ff0000' : 'none'}
          />
        </TouchableOpacity>

        {/* Stepper or ADD */}
        {outOfStock ? (
          <View style={[styles.addButton, styles.unavailableButton]}>
            <Text style={styles.unavailableText}>ADD</Text>
          </View>
        ) : cartQty > 0 ? (
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={handleDecrease} activeOpacity={0.8}>
              <Minus size={14} color="#263077" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.stepQty}>{cartQty}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={handleIncrease} activeOpacity={0.8}>
              <Plus size={14} color="#263077" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF3F5',
  },
  topRow: {
    flexDirection: 'row',
  },
  imageArea: {
    width: 110,
    height: 110,
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  stockBadge: {
    position: 'absolute',
    left: 5,
    right: 5,
    bottom: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(27, 34, 50, 0.82)',
    borderRadius: 6,
    paddingVertical: 4,
    zIndex: 3,
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  outOfStockBanner: { position: 'absolute', left: -8, right: -8, bottom: -1, height: 37, zIndex: 4 },
  outOfStockBannerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  image: {
    width: '80%',
    height: '80%',
  },
  imagePending: {
    opacity: 0,
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ECEFF3',
    borderRadius: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#043250',
    lineHeight: 17,
  },
  tablets: {
    fontSize: 11,
    color: '#787887',
    marginTop: 4,
  },
  mrp: {
    fontSize: 11,
    color: '#949494',
    marginTop: 6,
  },
  mrpAmount: { textDecorationLine: 'line-through' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E1442',
  },
  discountPct: {
    fontSize: 12,
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
    fontSize: 11,
    color: '#787887',
    marginRight: 6,
  },
  zapCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    letterSpacing: 0.5,
  },
  unavailableButton: {
    backgroundColor: '#F1F2F4',
  },
  unavailableText: {
    color: '#777C85',
    fontSize: 11,
    fontWeight: '800',
  },
  // Stepper
  stepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#263077',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQty: {
    fontSize: 15,
    fontWeight: '800',
    color: '#263077',
    minWidth: 24,
    textAlign: 'center',
  },
});

export default CategoryProductCard;
