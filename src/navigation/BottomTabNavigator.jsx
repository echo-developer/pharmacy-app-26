import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LayoutGrid, ClipboardList, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import MyOrdersScreen from '../screens/myorders/MyOrdersScreen';
import AccountScreen from '../screens/account/AccountScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#263077',
        tabBarInactiveTintColor: '#787887',
        tabBarStyle: {
          height: 78 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 22,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EAEAEA',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -2,
          marginBottom: 4,
        },
      }}
    >
      {/* Home Tab (Left aligned) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          tabBarItemStyle: {
            alignItems: 'flex-start',
            paddingLeft: 16,
            maxWidth: 80,
          },
        }}
      />

      {/* Categories Tab */}
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid size={size} color={color} />
          ),
        }}
      />

      {/* My Orders Tab */}
      <Tab.Screen
        name="My Orders"
        component={MyOrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />

      {/* Account Tab */}
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;