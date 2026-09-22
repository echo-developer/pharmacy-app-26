import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldPlus, Pill } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const VitaminsHeader = ({
  subtitle = 'Nourish their growth with',
  title = 'Vitamins & Supplements',
}) => {
  return (
    <View style={styles.container}>
      {/* LEFT SIDE: Text + Underline */}
      <View style={styles.textColumn}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>

        {/* Orange Gradient Underline */}
        <LinearGradient
          colors={['#F5A623', '#FFD199']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.underline}
        />
      </View>

      {/* RIGHT SIDE: 3D Icons */}
      <View style={styles.iconRow}>
        <View style={[styles.iconWrapper, styles.shieldWrapper]}>
          <ShieldPlus size={26} color="#FFFFFF" strokeWidth={2.5} />
        </View>

        <View style={[styles.iconWrapper, styles.pillWrapper]}>
          <Pill size={22} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  textColumn: {
    flex: 1,
    marginRight: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#4C6269',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#252525',
    letterSpacing: 0.3,
  },
  underline: {
    marginTop: 6,
    height: 4,
    width: 140,
    borderRadius: 2,
  },

  /* ===== 3D Icons ===== */
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // 3D shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  shieldWrapper: {
    backgroundColor: '#F5A623',    // Orange shield
    transform: [{ rotate: '-8deg' }], // Thora tilt 3D effect
    zIndex: 2,
  },
  pillWrapper: {
    backgroundColor: '#7C5CFF',    // Purple pill
    marginLeft: -8,                 // Overlap with shield
    transform: [{ rotate: '10deg' }],
    zIndex: 1,
  },
});

export default VitaminsHeader;