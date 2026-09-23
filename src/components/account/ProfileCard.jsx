import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Pencil, ChevronRight } from 'lucide-react-native';

const ProfileCard = ({
  phone = '+91 9812345678',
  email = 'Add your email',
  onEditPress,
  onEmailPress,
}) => {
  return (
    <View style={styles.container}>
      {/* LEFT: Avatar Circle */}
      <View style={styles.avatarCircle}>
        <User size={36} color="#333333" fill="#333333" />
      </View>

      {/* CENTER: Phone + Email */}
      <View style={styles.textColumn}>
        <Text style={styles.phone}>{phone}</Text>

        <TouchableOpacity
          style={styles.emailRow}
          onPress={onEmailPress}
          activeOpacity={0.7}
        >
          <Text style={styles.email}>{email}</Text>
          <ChevronRight size={13} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* RIGHT: Edit Button — white square card */}
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Pencil size={18} color="#333333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textColumn: {
    flex: 1,
  },
  phone: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 0.3,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  email: {
    fontSize: 13,
    color: '#333333',
    marginRight: 2,
    textDecorationLine: 'underline',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
});

export default ProfileCard;
