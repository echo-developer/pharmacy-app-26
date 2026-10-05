import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AccountHeader from '../../components/account/AccountHeader';
import ProfileCard from '../../components/account/ProfileCard';
import QuickActions from '../../components/account/QuickActions';
import AppUpdateBanner from '../../components/account/AppUpdateBanner';
import { Heart, Map, Share2, Info, ShieldCheck, Bell, MessageSquare, RotateCcw, Tag, RotateCw, Gift } from 'lucide-react-native';
import SettingsSection from '../../components/account/SettingsSection';
import SettingsRow from '../../components/account/SettingsRow';
import LogoutButton from '../../components/account/LogoutButton';
import { AuthContext } from '../../authcontext';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import { useFocusEffect } from '@react-navigation/native';

const AccountScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signOut, loginState } = useContext(AuthContext);
  const [walletBalance, setWalletBalance] = useState(0);
  const [profile, setProfile] = useState(() => store.getState().GlobalReducer.authuser || loginState?.userToken || {});

  useEffect(() => {
    loadWalletBalance();
  }, []);

  useFocusEffect(useCallback(() => {
    setProfile(store.getState().GlobalReducer.authuser || loginState?.userToken || {});
  }, [loginState?.userToken]));

  const loadWalletBalance = () => {
    CommonService._callApi({
      api: '/member/wallet',
      method: 'GET',
    })
      .then(resp => {
        if (resp.data.status === 1) {
          setWalletBalance(resp.data.response.data.balance || 0);
        }
      })
      .catch(err => {
        console.log('Error loading wallet balance:', err);
      });
  };

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleWalletPress = () => {
    const balance = typeof walletBalance === 'number' ? walletBalance.toFixed(2) : '0.00';
    Alert.alert(
      'Wallet Balance',
      `Your current wallet balance is ₹${balance}`,
      [
        { text: 'OK', onPress: () => {} }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing Pharmacy App! Download it now.',
        url: 'https://play.google.com/store/apps/details?id=com.pharmacyapp',
      });
    } catch (error) {
      console.log('Error sharing app:', error);
    }
  };

  const handleNotifications = () => {
    navigation.navigate('NotificationPreferences');
  };

  const handleHelpPress = () => {
    navigation.navigate('ContactSupport');
  };

  const handleAppUpdate = () => {
    Alert.alert(
      'App Update',
      'You are using the latest version of the app.',
      [
        { text: 'OK', onPress: () => {} }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEmailPress = () => {
    const email = profile?.member_email || profile?.email;
    if (email && email !== 'Add your email') {
      Alert.alert(
        'Email Address',
        email,
        [
          { text: 'OK', onPress: () => {} }
      ]
      );
    } else {
      Alert.alert(
        'Add Email',
        'Would you like to add your email address?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add', onPress: handleEditProfile }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

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
          onWalletPress={handleWalletPress}
        />
        <ProfileCard
          phone={profile?.member_phone || profile?.mobile || profile?.phone || 'Add your mobile number'}
          email={profile?.member_email || profile?.email || 'Add your email'}
          onEditPress={handleEditProfile}
          onEmailPress={handleEmailPress}
        />
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <QuickActions
          onOrdersPress={() => navigation.navigate('My Orders')}
          onWalletPress={handleWalletPress}
          onHelpPress={handleHelpPress}
        />
        <AppUpdateBanner
          title="App Update Available"
          subtitle="Bug Fixes & Improvements"
          version="V1.010"
          onPress={handleAppUpdate}
        />
        <SettingsSection title="Information">
          <SettingsRow Icon={Tag} label="Offers" onPress={() => navigation.navigate('Offers')} showDivider />
          <SettingsRow Icon={RotateCw} label="Buy Again" onPress={() => navigation.navigate('BuyAgain')} showDivider />
          <SettingsRow
            Icon={Heart}
            label="Wishlist"
            onPress={() => navigation.navigate('Wishlist')}
            showDivider
          />
          <SettingsRow
            Icon={Map}
            label="Address"
            onPress={() => navigation.navigate('MyAddress')}
            showDivider
          />
          <SettingsRow
            Icon={Gift}
            label="Referral program"
            onPress={() => navigation.navigate('Referral')}
          />
        </SettingsSection>
        <SettingsSection title="About">
          <SettingsRow
            Icon={Share2}
            label="Share the app"
            onPress={handleShareApp}
            showDivider
          />
          <SettingsRow
            Icon={Info}
            label="About"
            onPress={() => navigation.navigate('AboutUs', { title: 'About Us', type: 'about' })}
            showDivider
          />
          <SettingsRow
            Icon={ShieldCheck}
            label="Account Privacy"
            onPress={() => navigation.navigate('WebScreen', { title: 'Account Privacy', type: 'privacy' })}
            showDivider
          />
          <SettingsRow
            Icon={Bell}
            label="Notifications"
            onPress={handleNotifications}
            showDivider
          />
          <SettingsRow
            Icon={MessageSquare}
            label="FAQ"
            onPress={() => navigation.navigate('Faq', { title: 'FAQ', type: 'faq' })}
            showDivider
          />
          <SettingsRow
            Icon={RotateCcw}
            label="Return Policy"
            onPress={() => navigation.navigate('ReturnPolicy', { title: 'Return Policy', type: 'return' })}
            showDivider
          />
          <SettingsRow
            Icon={RotateCcw}
            label="Cancellation Policy"
            onPress={() => navigation.navigate('CancellationPolicy', { title: 'Cancellation Policy', type: 'cancellation' })}
          />
        </SettingsSection>
        <LogoutButton onPress={handleLogout} />
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
