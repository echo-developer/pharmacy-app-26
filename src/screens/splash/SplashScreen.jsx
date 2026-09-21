import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  ImageBackground,
  useWindowDimensions,   
} from 'react-native';

const SplashScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions(); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (navigation) {
        navigation.replace('Home');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  
  const styles = getStyles(width, height);

  return (
    <ImageBackground
      source={require('../../assets/images/splash_bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../assets/images/logo.png')}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.heartIcon}>❤️</Text>
        <Text style={styles.madeInIndiaText}>Made in India</Text>
      </View>
    </ImageBackground>
  );
};

const getStyles = (width, height) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: width,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    logo: {
      width: width * 0.65,
      height: height * 0.25,
    },
    footer: {
      position: 'absolute',
      bottom: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heartIcon: {
      fontSize: 26,
      marginBottom: 6,
    },
    madeInIndiaText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2D2D32',
      letterSpacing: 0.5,
    },
  });

export default SplashScreen;