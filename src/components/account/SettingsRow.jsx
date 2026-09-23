import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const SettingsRow = ({
  Icon,
  label,
  onPress,
  showDivider = false,
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={onPress}
      >
        {Icon && (
          <View style={styles.iconWrapper}>
            <Icon size={20} color="#333333" />
          </View>
        )}

        <Text style={styles.label}>{label}</Text>

        <ChevronRight size={18} color="#333333" />
      </TouchableOpacity>

      {showDivider && (
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  iconWrapper: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },

  /* ===== Divider with left + right gap ===== */
  dividerWrapper: {
    paddingHorizontal: 16,          // Left + right gap
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E3E2',
  },
});

export default SettingsRow;