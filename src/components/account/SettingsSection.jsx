import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsSection = ({ title, children }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Section Title INSIDE card */}
        <Text style={styles.title}>{title}</Text>

        {/* Rows */}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    paddingTop: 14,                 // Title ke upar space
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    marginLeft: 16,                 // Card ke andar padding
  },
});

export default SettingsSection;