import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderActions = ({ actions }) => {
  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={action.onPress}
          >
            <Text style={styles.buttonText}>{action.label}</Text>
          </TouchableOpacity>

          {/* Divider between buttons (not after last) */}
          {index < actions.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#E4E3E2',
    backgroundColor: '#FFFFFF',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',       // All text color
  },
  divider: {
    width: 1,
    backgroundColor: '#E4E3E2',
  },
});

export default OrderActions;