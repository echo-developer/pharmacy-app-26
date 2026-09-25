import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import {
  Thermometer,
  Calendar,
  ShieldCheck,
  MapPin,
  Bike,
  ChevronRight,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

// Simple price formatter — no external dependency needed
const formatPrice = (value) => {
  if (value == null) return '₹0.00';
  return '₹' + Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ProductInfoCard = ({
  product,
  onLocationPress,
  onDeliveryPress,
  onPackPress,
  onAgePress,
}) => {
  const [activePack, setActivePack] = useState(product?.product_id ?? null);

  if (!product) return null;

  const packSizes = product.productGroup || [];
  const selectedPack = activePack
    ? (packSizes.find(p => p.product_id === activePack) || null)
    : null;

  const displayPrice = selectedPack?.product_sell_price ?? product.product_sell_price;
  const displayMrp = selectedPack?.product_mrp ?? product.product_mrp;
  const displayUnit = selectedPack?.unit ?? product.unit ?? '';
  const displayDiscount = product.discount;

  return (
    <View style={styles.wrapper}>

      {/* ========== 1. TITLE / MRP / PRICE ========== */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{product.product_name}</Text>

        {/* Veg/Non-veg indicator */}
        {product.setting?.is_food == 1 && (
          <View style={styles.vegRow}>
            <View
              style={[
                styles.vegBox,
                {
                  borderColor: product.setting?.is_veg == 0 ? '#8B0000' : '#709c29',
                },
              ]}>
              <View
                style={[
                  styles.vegDot,
                  {
                    backgroundColor: product.setting?.is_veg == 0 ? '#8B0000' : '#709c29',
                  },
                ]}
              />
            </View>
            <Text style={styles.vegLabel}>
              {product.setting?.is_veg == 0 ? 'Non-Veg' : 'Veg'}
            </Text>
          </View>
        )}

        {/* MRP */}
        {displayMrp != displayPrice && (
          <Text style={styles.mrp}>MRP {formatPrice(displayMrp)}</Text>
        )}

        {/* Sell Price + Discount */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(displayPrice)}</Text>
          {displayDiscount && product.product_discount_type !== 'F' ? (
            <Text style={styles.discount}>{displayDiscount} OFF</Text>
          ) : null}
        </View>

        {displayUnit ? (
          <Text style={styles.unitPrice}>{displayUnit} · Incl. of all taxes</Text>
        ) : (
          <Text style={styles.unitPrice}>Incl. of all taxes</Text>
        )}
      </View>

      {/* ========== 2. INFO BADGES ========== */}
      <View style={styles.pinkWrapper}>
        <View style={styles.infoRow}>
          <View style={styles.infoBoxWrapper}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Thermometer size={18} color="#333333" />
              </View>
              <Text style={styles.infoText}>Temperature{'\n'}Controlled</Text>
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.infoBoxWrapper}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Calendar size={18} color="#333333" />
              </View>
              <Text style={styles.infoText}>
                {product.expire_date ? `Expires${'\n'}${product.expire_date}` : 'Expiry{"\n"}Date N/A'}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.infoBoxWrapper}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={18} color="#333333" />
              </View>
              <Text style={styles.infoText}>NPPA{'\n'}Regulated</Text>
            </View>
          </View>
        </View>

        {/* Pack Sizes from API */}
        {packSizes.length > 0 && (
          <View style={styles.whiteSubTab}>
            <Text style={styles.packLabel}>
              Pack Size:{' '}
              <Text style={styles.packLabelBold}>{displayUnit}</Text>
            </Text>

            <View style={styles.packRow}>
              {packSizes.map(pack => {
                const isActive = activePack === pack.product_id;
                const packDiscount =
                  pack.discount ||
                  (pack.product_mrp && pack.product_sell_price &&
                    pack.product_mrp != pack.product_sell_price
                    ? Math.round(
                      ((pack.product_mrp - pack.product_sell_price) /
                        pack.product_mrp) *
                      100,
                    ) + '% OFF'
                    : null);

                return (
                  <Pressable
                    key={pack.product_id}
                    style={styles.packWrapper}
                    onPress={() => {
                      setActivePack(pack.product_id);
                      onPackPress?.(pack);
                    }}>
                    {isActive ? (
                      <LinearGradient
                        colors={['#BE7152', 'rgba(190,113,82,0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.packUnitsStripActive}>
                        <Text style={styles.packUnitsTextActive}>{pack.unit}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.packUnitsStripInactive}>
                        <Text style={styles.packUnitsTextInactive}>{pack.unit}</Text>
                      </View>
                    )}
                    <View style={styles.packPriceBox}>
                      <Text style={styles.packPrice}>
                        {formatPrice(pack.product_sell_price ?? product.product_sell_price)}
                      </Text>
                      {packDiscount ? (
                        <Text style={styles.packPer}>{packDiscount}</Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* ========== 3. LOCATION + DELIVERY ========== */}
      <View style={styles.locationBlock}>
        <View style={styles.locationCard}>
          <TouchableOpacity
            style={[styles.rowTab, styles.locationTab]}
            onPress={onLocationPress}
            activeOpacity={0.85}>
            <MapPin size={18} color="#263077" />
            <Text style={styles.rowText}>
              <Text style={styles.locationLight}>Location not set </Text>
              <Text style={styles.locationBold}>Select delivery location</Text>
            </Text>
            <ChevronRight size={18} color="#263077" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowTab, styles.deliveryTab]}
            onPress={onDeliveryPress}
            activeOpacity={0.85}>
            <Bike size={18} color="#333333" />
            <Text style={styles.deliveryText}>
              Check delivery availability
            </Text>
            <ChevronRight size={18} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },

  /* ========== 1. TITLE SECTION ========== */
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E1442',
    lineHeight: 22,
  },
  vegRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  vegBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vegLabel: {
    fontSize: 11,
    color: '#555',
    marginLeft: 6,
  },
  mrp: {
    fontSize: 12,
    color: '#949494',
    textDecorationLine: 'line-through',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263077',
  },
  discount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6565',
    marginLeft: 8,
  },
  unitPrice: {
    fontSize: 11,
    color: '#4D6979',
    marginTop: 4,
  },

  /* ========== 2. PINK TAB ========== */
  pinkWrapper: {
    backgroundColor: '#EFE0E0',
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 0,
    marginHorizontal: 16,
  },

  /* Info Boxes */
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  infoBoxWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 13,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: '#D5C8C8',
  },

  /* White Sub-Tab for Pack Sizes */
  whiteSubTab: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginTop: 14,
  },
  packLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 12,
  },
  packLabelBold: {
    fontWeight: '800',
    color: '#263077',
  },
  packRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  packWrapper: {
    width: 130,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E1BDAF',
  },
  packUnitsStripActive: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  packUnitsStripInactive: {
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#FCECE6',
  },
  packUnitsTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  packUnitsTextInactive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C27B5E',
  },
  packPriceBox: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  packPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263077',
  },
  packPer: {
    fontSize: 10,
    color: '#2A2A2A',
    marginTop: 2,
  },

  /* ========== 3. LOCATION + DELIVERY ========== */
  locationBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  rowTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  locationTab: {
    backgroundColor: '#EEF7FF',
  },
  deliveryTab: {
    backgroundColor: '#F5F5F5',
  },
  rowText: {
    flex: 1,
    fontSize: 13,
  },
  locationLight: {
    color: '#263077',
    fontWeight: '400',
  },
  locationBold: {
    color: '#263077',
    fontWeight: '700',
  },
  deliveryText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  deliveryBold: {
    fontWeight: '700',
    color: '#333333',
  },
});

export default ProductInfoCard;
