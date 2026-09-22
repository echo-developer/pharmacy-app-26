import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({ text, style }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={['#049482', '#026E93', '#051727']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.24, 1]}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const HealthConcernHeader = ({
  title = 'Shop by Health Concern',
  subtitle = 'Everyday care for a healthier you',
  onArrowPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        {/* Title with Gradient */}
        <GradientText text={title} style={styles.title} />

        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Arrow Button */}
      <TouchableOpacity style={styles.arrowButton} onPress={onArrowPress}>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',           // Subtitle color
    marginTop: 2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#263077', // Arrow tab background
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HealthConcernHeader;