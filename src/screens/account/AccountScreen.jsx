import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AccountHeader from '../../components/account/AccountHeader';
import ProfileCard from '../../components/account/ProfileCard';
import QuickActions from '../../components/account/QuickActions';
import AppUpdateBanner from '../../components/account/AppUpdateBanner';
import { Heart, Map, Share2,Info,ShieldCheck,Bell,MessageSquare,RotateCcw, } from 'lucide-react-native';
import SettingsSection from '../../components/account/SettingsSection';
import SettingsRow from '../../components/account/SettingsRow';
import LogoutButton from '../../components/account/LogoutButton';
import { AuthContext } from '../../authcontext';

const AccountScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signOut, loginState } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
          onWalletPress={() => console.log('Wallet pressed')}
        />
        <ProfileCard
          phone={loginState?.userToken?.mobile || loginState?.userToken?.phone || '+91 9812345678'}
          email={loginState?.userToken?.email || 'Add your email'}
          onEditPress={() => console.log('Edit pressed')}
          onEmailPress={() => console.log('Email pressed')}
        />
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <QuickActions
          onOrdersPress={() => navigation.navigate('My Orders')}
          onWalletPress={() => console.log('Wallet pressed')}
          onHelpPress={() => console.log('Help pressed')}
        />
        <AppUpdateBanner
          title="App Update Available"
          subtitle="Bug Fixes & Improvements"
          version="V1.010"
          onPress={() => console.log('Update pressed')}
        />
        <SettingsSection title="Information">
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
          />
        </SettingsSection>
        <SettingsSection title="About">
          <SettingsRow
            Icon={Share2}
            label="Share the app"
            onPress={() => console.log('Share')}
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
            onPress={() => console.log('Notifications')}
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
