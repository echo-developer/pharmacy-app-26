import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2CB7DF',
        tabBarInactiveTintColor: '#787887',
        tabBarStyle: {
          height: 64 + insets.bottom,           // Height badhayi
          paddingTop: 10,                       // Icon ke liye upar se space
          paddingBottom: insets.bottom + 8,     // Status bar ke upar safe space
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EAEAEA',
        },
        tabBarItemStyle: {
          alignItems: 'flex-start',             // Left align
          paddingLeft: 16,                      // Left shift
          maxWidth: 80,                         // Choti width
        },
        tabBarIcon: ({ color, size }) => (
          <Home size={size} color={color} />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -2,                         // Text ko icon ke paas laane ke liye
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;