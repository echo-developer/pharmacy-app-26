import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrderDetailsScreen from '../screens/myorders/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/myorders/OrderTrackingScreen';
import MyOrdersScreen from '../screens/myorders/MyOrdersScreen';
import { AuthContext } from '../authcontext';
import { View, Text, StyleSheet } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import SearchScreen from '../screens/search/SearchScreen';
import ProductsScreen from '../screens/product/ProductsScreen';
import PaymentMethodScreen from '../screens/cart/PaymentMethodScreen';
import AddressManageScreen from '../screens/account/AddressManageScreen';
import WishlistScreen from '../screens/account/WishlistScreen';
import WebScreen from '../screens/account/WebScreen';
import OffersScreen from '../screens/discovery/OffersScreen';
import BuyAgainScreen from '../screens/discovery/BuyAgainScreen';
import ProfileEditScreen from '../screens/account/ProfileEditScreen';
import ReferralScreen from '../screens/account/ReferralScreen';
import NotificationPreferencesScreen from '../screens/account/NotificationPreferencesScreen';
import ContactSupportScreen from '../screens/account/ContactSupportScreen';
import OrderReviewScreen from '../screens/myorders/OrderReviewScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="MyAddress" component={AddressManageScreen} />
        <Stack.Screen name="ConfirmLocation" component={AddressManageScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="WebScreen" component={WebScreen} />
        <Stack.Screen name="Offers" component={OffersScreen} />
        <Stack.Screen name="BuyAgain" component={BuyAgainScreen} />
        <Stack.Screen name="EditProfile" component={ProfileEditScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
        <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
        <Stack.Screen name="OrderReview" component={OrderReviewScreen} />
        <Stack.Screen name="AboutUs" component={WebScreen} />
        <Stack.Screen name="Faq" component={WebScreen} />
        <Stack.Screen name="ReturnPolicy" component={WebScreen} />
        <Stack.Screen name="CancellationPolicy" component={WebScreen} />
        <Stack.Screen name="My Orders" component={MyOrdersScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
});

export default AppNavigator;
