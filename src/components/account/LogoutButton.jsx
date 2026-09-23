import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.text}>Log Out</Text>
      <LogOut size={20} color="#FF383C" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E3E2',       // Borderline surrounding
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF383C',             // Log Out text
  },
  icon: {
    marginLeft: 8,
  },
});

export default LogoutButton;