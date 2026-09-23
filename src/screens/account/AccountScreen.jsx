import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AccountHeader from '../../components/account/AccountHeader';
import ProfileCard from '../../components/account/ProfileCard';
import QuickActions from '../../components/account/QuickActions';

const AccountScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Single gradient covers statusbar + header + profile card */}
      <LinearGradient
        colors={['#E4E5EF', '#F6F6F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingTop: insets.top }}
      >
        <AccountHeader
          title="My Account"
          onBackPress={() => navigation.goBack()}
          onWalletPress={() => console.log('Wallet pressed')}
        />
        <ProfileCard
          phone="+91 9812345678"
          email="Add your email"
          onEditPress={() => console.log('Edit pressed')}
          onEmailPress={() => console.log('Email pressed')}
        />
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
      <QuickActions
          onOrdersPress={() => console.log('Orders pressed')}
          onWalletPress={() => console.log('Wallet pressed')}
          onHelpPress={() => console.log('Help pressed')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scrollArea: {
    flex: 1,
  },
});

export default AccountScreen;
