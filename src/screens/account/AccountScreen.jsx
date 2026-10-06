import React, { useContext, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, Share, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AccountHeader from '../../components/account/AccountHeader';
import ProfileCard from '../../components/account/ProfileCard';
import QuickActions from '../../components/account/QuickActions';
import AppUpdateBanner from '../../components/account/AppUpdateBanner';
import { Heart, Map, Share2, Info, ShieldCheck, Bell, MessageSquare, RotateCcw, Tag, RotateCw, Gift, Trash2 } from 'lucide-react-native';
import SettingsSection from '../../components/account/SettingsSection';
import SettingsRow from '../../components/account/SettingsRow';
import LogoutButton from '../../components/account/LogoutButton';
import { AuthContext } from '../../authcontext';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import StaticConst from '../../utils/StaticConst';
import { errorCodes, isErrorWithCode, pick, types } from '@react-native-documents/picker';

const AccountScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signOut, loginState } = useContext(AuthContext);
  const [walletBalance, setWalletBalance] = useState(0);
  const [profile, setProfile] = useState(() => store.getState().GlobalReducer.authuser || loginState?.userToken || {});
  const [deletionRequestLoading, setDeletionRequestLoading] = useState(false);
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);

  useFocusEffect(useCallback(() => {
    const authuser = store.getState().GlobalReducer.authuser || loginState?.userToken;
    if (!authuser) {
      navigation.navigate('Login', {
        returnTo: { name: 'Main', params: { screen: 'Account' } },
      });
      return;
    }
    setProfile(authuser);
    loadWalletBalance();
  }, [loginState?.userToken, navigation]));

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
      routes: [{ name: 'Main' }],
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

  const submitAccountDeletionRequest = async () => {
    setDeletionRequestLoading(true);
    try {
      const response = await CommonService._callApi({
        api: '/member/request_account_deletion',
        method: 'POST',
        body: JSON.stringify({}),
      }).then(resp => resp.json());
      if (Number(response?.status) !== 1) {
        throw new Error(
          response?.response?.message ||
          response?.response?.data?.message ||
          response?.message ||
          'We could not submit your request right now. Please try again later.',
        );
      }
      Alert.alert(
        'Request Submitted',
        response?.response?.message ||
          'Your account deletion request has been received. Our team will process it and delete your account within 7 days.',
      );
    } catch (error) {
      Alert.alert(
        'Unable to Submit',
        error?.message || 'Please check your connection and try again.',
      );
    } finally {
      setDeletionRequestLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will submit a request to delete your account. Our team will process it within 7 days. Account deletion may be permanent once processed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          style: 'destructive',
          onPress: submitAccountDeletionRequest,
        },
      ],
      { cancelable: true },
    );
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

  const handleProfilePhotoPress = async () => {
    if (profilePhotoUploading) return;
    try {
      const [file] = await pick({ type: [types.images] });
      if (!file?.uri) {
        Alert.alert('Photo unavailable', 'Please choose an image and try again.');
        return;
      }

      setProfilePhotoUploading(true);
      const form = new FormData();
      form.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'profile-photo.jpg',
      });
      const response = await CommonService._callApi({
        api: '/member/upload_logo',
        method: 'CONVERT',
        body: form,
      }).then(result => result.json());
      if (Number(response?.status) !== 1) {
        throw new Error(response?.response?.message || response?.message || 'Could not upload your profile photo.');
      }

      const uploaded = response.response?.data || {};
      const nextProfile = {
        ...profile,
        ...(uploaded.member_logo ? { member_logo: uploaded.member_logo } : {}),
        ...(uploaded.image ? { member_logo_url: uploaded.image } : {}),
      };
      await AsyncStorage.setItem(StaticConst.userauth.key, base64.encode(JSON.stringify(nextProfile)));
      store.dispatch({ type: 'SETAUTHUSER', payload: nextProfile });
      setProfile(nextProfile);
      Alert.alert('Photo updated', 'Your profile photo has been updated.');
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert('Upload failed', error?.message || 'Please try again later.');
    } finally {
      setProfilePhotoUploading(false);
    }
  };

  const memberPhoto = profile?.member_logo_url || profile?.image || (profile?.member_logo
    ? (/^https?:\/\//i.test(profile.member_logo)
      ? profile.member_logo
      : `${StaticConst.api.endpoint.replace(/\/api\/app\/?$/i, '')}/useruploads/member-logo/${String(profile.member_logo).replace(/^\/+/, '')}`)
    : undefined);

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
          avatarUri={memberPhoto}
          uploadingAvatar={profilePhotoUploading}
          onAvatarPress={handleProfilePhotoPress}
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
        <TouchableOpacity
          style={styles.deleteAccountButton}
          activeOpacity={0.7}
          onPress={handleDeleteAccount}
          disabled={deletionRequestLoading}
        >
          {deletionRequestLoading ? (
            <ActivityIndicator color="#D93036" />
          ) : (
            <>
              <Trash2 size={18} color="#D93036" />
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </>
          )}
        </TouchableOpacity>
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
  deleteAccountButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1C9CB',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 28,
  },
  deleteAccountText: {
    color: '#D93036',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default AccountScreen;
