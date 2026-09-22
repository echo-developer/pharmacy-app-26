import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Truck, Headphones } from 'lucide-react-native';

const badges = [
  {
    id: 1,
    icon: ShieldCheck,
    iconColor: '#2CB7DF',
    title: 'Genuine',
    subtitle: 'Products',
  },
  {
    id: 2,
    icon: Truck,
    iconColor: '#2CB7DF',
    title: 'Fast & Secure',
    subtitle: 'Delivery',
  },
  {
    id: 3,
    icon: Headphones,
    iconColor: '#6C63FF',
    title: 'Expert',
    subtitle: 'Support',
  },
];

const TrustBadges = () => {
  return (
    <View style={styles.container}>
      {badges.map((item, index) => {
        const Icon = item.icon;
        return (
          <View key={item.id} style={styles.badgeWrapper}>
            <View style={styles.iconWrapper}>
              <Icon size={22} color={item.iconColor} />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.title}>{item.title}</Text>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: '#44455',      // Middle section background
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    marginRight: 8,
  },
  textWrapper: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#113A6A',              // Title color
  },
  subtitle: {
    fontSize: 11,
    color: '#4C6269',              // Subtitle color
    marginTop: 1,
  },
  divider: {
    position: 'absolute',
    right: 0,
    top: 6,
    bottom: 6,
    width: 1,
    backgroundColor: '#EAEAEA',
  },
});

export default TrustBadges;