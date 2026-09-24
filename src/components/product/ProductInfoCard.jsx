import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Thermometer,
  Calendar,
  ShieldCheck,
  MapPin,
  Bike,
  ChevronRight,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const AGE_OPTIONS = ['18 - 60 Years', '18 - 60 Years'];
const PACK_SIZES = [
  { id: 1, units: '60 Units', price: '210.75', perTablet: '3.51/tablet' },
  { id: 2, units: '60 Units', price: '210.75', perTablet: '3.51/tablet' },
  { id: 3, units: '60 Units', price: '210.75', perTablet: '3.51/tablet' },
];

const ProductInfoCard = ({
  title = 'MuscleBlaze Biozyme Whey Protein',
  mrp = '4599',
  price = '1949',
  discount = '58% OFF',
  unitPrice = '2.14/gram (Inclusive off all taxes)',
  onLocationPress,
  onDeliveryPress,
  onPackPress,
  onAgePress,
}) => {
  const [activeAge, setActiveAge] = useState(0);
  const [activePack, setActivePack] = useState(1);

  return (
    <View style={styles.wrapper}>

      {/* ========== 1. TITLE / MRP / PRICE ========== */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.mrp}>MRP ₹{mrp}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>~₹{price}</Text>
          <Text style={styles.discount}>{discount}</Text>
        </View>
        <Text style={styles.unitPrice}>{unitPrice}</Text>
      </View>

      {/* ========== 2. PINK TAB ========== */}
      <View style={styles.pinkWrapper}>

        {/* Info Boxes */}
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
              <Text style={styles.infoText}>Expire on{'\n'}12 Sep, 2028</Text>
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

        {/* White Sub-Tab (Age + Pack Size) */}
        <View style={styles.whiteSubTab}>

          {/* Age */}
          <View style={styles.ageHeaderRow}>
            <Text style={styles.ageLabel}>Age: </Text>
            <Text style={styles.ageValue}>18 - 60 Years</Text>
          </View>

          <View style={styles.agePillsRow}>
            {AGE_OPTIONS.map((age, index) => {
              const isActive = activeAge === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.agePill, isActive ? styles.agePillActive : styles.agePillInactive]}
                  onPress={() => { setActiveAge(index); onAgePress?.(age); }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.agePillText, isActive ? styles.agePillTextActive : styles.agePillTextInactive]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pack Size */}
          <Text style={styles.packLabel}>
            Pack Size: <Text style={styles.packLabelBold}>60 Units</Text>
          </Text>

          <View style={styles.packRow}>
            {PACK_SIZES.map((pack) => {
              const isActive = activePack === pack.id;
              return (
                <TouchableOpacity
                  key={pack.id}
                  style={styles.packWrapper}
                  activeOpacity={0.85}
                  onPress={() => { setActivePack(pack.id); onPackPress?.(pack); }}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#BE7152', 'rgba(190,113,82,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.packUnitsStripActive}
                    >
                      <Text style={styles.packUnitsTextActive}>{pack.units}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.packUnitsStripInactive}>
                      <Text style={styles.packUnitsTextInactive}>{pack.units}</Text>
                    </View>
                  )}
                  <View style={styles.packPriceBox}>
                    <Text style={styles.packPrice}>₹{pack.price}</Text>
                    <Text style={styles.packPer}>₹{pack.perTablet}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </View>

      {/* ========== 3. LOCATION + DELIVERY ========== */}
      <View style={styles.locationBlock}>
        <View style={styles.locationCard}>

          <TouchableOpacity
            style={[styles.rowTab, styles.locationTab]}
            onPress={onLocationPress}
            activeOpacity={0.85}
          >
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
            activeOpacity={0.85}
          >
            <Bike size={18} color="#333333" />
            <Text style={styles.deliveryText}>
              Delivery by <Text style={styles.deliveryBold}>Monday, 21 Sep</Text>
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
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    marginHorizontal: 16,
  },

  /* Info Boxes */
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
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

  /* White Sub-Tab */
  whiteSubTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginTop: 14,
  },

  /* Age */
  ageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#2A2A2A',
    fontWeight: '600',
  },
  ageValue: {
    fontSize: 14,
    color: '#263077',
    fontWeight: '700',
  },
  agePillsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  agePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  agePillActive: {
    backgroundColor: '#263077',
    borderColor: '#263077',
  },
  agePillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#B7DBE5',
  },
  agePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  agePillTextActive: {
    color: '#FFFFFF',
  },
  agePillTextInactive: {
    color: '#6A6A6A',
  },

  /* Pack Size */
  packLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    marginTop: 20,
    marginBottom: 12,
  },
  packLabelBold: {
    fontWeight: '800',
    color: '#263077',
  },
  packRow: {
    flexDirection: 'row',
    gap: 10,
  },
  packWrapper: {
    flex: 1,
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
