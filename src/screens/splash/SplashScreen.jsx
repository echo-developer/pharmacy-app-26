import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const SplashScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [bgLoaded, setBgLoaded] = React.useState(false);
  const [logoLoaded, setLogoLoaded] = React.useState(false);

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
      if (navigation) navigation.replace('Main');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);


  const styles = getStyles(width, height);

  return (
    <View style={styles.backgroundImage}>
      {!bgLoaded && (
        <ShimmerPlaceholder
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          shimmerColor="#EAEAEA"
          shimmerBackgroundColor="#F5F5F5"
          visible={false}
        />
      )}
      <FastImage
        source={require('../../assets/images/splash_bg.png')}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode={FastImage.resizeMode.cover}
        onLoad={() => setBgLoaded(true)}
      />
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <View style={styles.logoContainer}>
        {!logoLoaded && (
          <ShimmerPlaceholder
            style={styles.logo}
            shimmerColor="#EAEAEA"
            shimmerBackgroundColor="#F5F5F5"
            visible={false}
          />
        )}
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
          onLoad={() => setLogoLoaded(true)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.heartIcon}>❤️</Text>
        <Text style={styles.madeInIndiaText}>Made in India</Text>
      </View>
    </View>
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
      backgroundColor: '#FFFFFF',
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
