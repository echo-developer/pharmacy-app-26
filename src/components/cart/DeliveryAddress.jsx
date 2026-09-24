import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Pencil } from 'lucide-react-native';

const DeliveryAddress = ({
  title = 'Delivering to House',
  address = '4517 Washington Ave Manchester',
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Mappin */}
      <View style={styles.iconWrapper}>
        <MapPin size={20} color="#2CB7DF" />
      </View>

      {/* Center: Text */}
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.address}>{address}...</Text>
      </View>

      {/* Right: Edit */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={onEditPress}
        activeOpacity={0.7}
      >
        <Pencil size={18} color="#263077" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
    // Only top + bottom borders
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E4E3E2',
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263077',
  },
  address: {
    fontSize: 11,
    color: '#787C77',
    marginTop: 3,
  },
  editBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DeliveryAddress;