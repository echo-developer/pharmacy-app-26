import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

const OrderDetailsHeader = ({
  title = 'Order Details',
  helpLabel = 'Help',
  onBackPress,
  onHelpPress,
}) => {
  return (
    <View style={styles.header}>
      {/* LEFT: Back + Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#25485B" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* RIGHT: Help Button */}
      <TouchableOpacity
        style={styles.helpTab}
        onPress={onHelpPress}
        activeOpacity={0.85}
      >
        <Text style={styles.helpText}>{helpLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 54,
    paddingBottom: 12,
    backgroundColor: '#F6F6F6',       // Header bg matches screen bg
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#043250',                 // Title color
    letterSpacing: 0.2,
  },
  helpTab: {
    backgroundColor: '#FFFFFF',       // Help tab bg
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },
  helpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#787C77',                 // Help text
  },
});

export default OrderDetailsHeader;