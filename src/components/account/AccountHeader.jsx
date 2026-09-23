import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Wallet } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const AccountHeader = ({
  title = 'My Account',
  walletAmount = '₹10',
  onBackPress,
  onWalletPress,
}) => {
  return (
    <View style={styles.container}>
      {/* LEFT: Back Arrow */}
      <TouchableOpacity style={styles.iconBtn} onPress={onBackPress}>
        <ArrowLeft size={22} color="#25485B" />
      </TouchableOpacity>

      {/* CENTER: Title */}
      <Text style={styles.title}>{title}</Text>

      {/* RIGHT: Wallet */}
      <TouchableOpacity style={styles.walletWrapper} onPress={onWalletPress}>
        <LinearGradient
          colors={['#1565C0', '#2CB7DF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletCircle}
        >
          <Wallet size={22} color="#FFFFFF" fill="#FFFFFF" />
        </LinearGradient>
        <View style={styles.walletBadge}>
          <Text style={styles.walletBadgeText}>{walletAmount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
    marginLeft: 4,
  },
  walletWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  walletCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#1565C0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  walletBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default AccountHeader;
