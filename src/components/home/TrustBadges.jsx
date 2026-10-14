import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const badges = [
  {
    id: 1,
    icon: require('../../assets/images/genuine.png'),
    title: 'Genuine',
    subtitle: 'Products',
  },
  {
    id: 2,
    icon: require('../../assets/images/delivery.png'),
    title: 'Fast & Secure',
    subtitle: 'Delivery',
  },
  {
    id: 3,
    icon: require('../../assets/images/support.png'),
    title: 'Expert',
    subtitle: 'Support',
  },
];

const TrustBadges = () => {
  return (
    <View style={styles.container}>
      {badges.map((item, index) => {
        return (
          <View key={item.id} style={[styles.badgeWrapper, index === 1 && styles.middleBadgeWrapper]}>
            <View style={styles.iconWrapper}>
              <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                {item.title}
              </Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            {index < badges.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 16,
    columnGap: 12,
    borderRadius: 12,
    backgroundColor: '#EAF7FA',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  middleBadgeWrapper: {
    transform: [{ translateX: 6 }],
  },
  iconWrapper: {
    marginRight: 6,
  },
  icon: {
    width: 22,
    height: 22,
  },
  textWrapper: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#113A6A',              // Title color
  },
  subtitle: {
    fontSize: 10,
    color: '#4C6269',              // Subtitle color
    marginTop: 1,
  },
  divider: {
    position: 'absolute',
    right: -6,
    top: -4,
    bottom: -4,
    width: 1,
    backgroundColor: '#A6CCD8',
  },
});

export default TrustBadges;
