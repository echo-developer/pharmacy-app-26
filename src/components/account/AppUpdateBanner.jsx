import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Smartphone, ChevronRight } from 'lucide-react-native';

const AppUpdateBanner = ({
  title = 'App Update Available',
  subtitle = 'Bug Fixes & Improvements',
  version = 'V1.010',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* LEFT: Mobile Icon Box */}
      <View style={styles.iconBox}>
        <Smartphone size={22} color="#787C77" />
      </View>

      {/* CENTER: Text */}
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* RIGHT: Version Pill + Chevron */}
      <View style={styles.rightGroup}>
        <View style={styles.versionPill}>
          <Text style={styles.versionText}>{version}</Text>
        </View>
        <ChevronRight size={18} color="#787C77" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== Icon Box ===== */
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E3E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  /* ===== Text ===== */
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#787C77',
    marginTop: 3,
  },

  /* ===== Right Group ===== */
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionPill: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#787C77',
  },
});

export default AppUpdateBanner;