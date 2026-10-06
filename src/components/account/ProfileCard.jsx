import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { User, Pencil, ChevronRight, Camera } from 'lucide-react-native';

const ProfileCard = ({
  phone = '+91 9812345678',
  email = 'Add your email',
  avatarUri,
  uploadingAvatar = false,
  onAvatarPress,
  onEditPress,
  onEmailPress,
}) => {
  return (
    <View style={styles.container}>
      {/* LEFT: Avatar Circle */}
      <TouchableOpacity
        style={styles.avatarCircle}
        onPress={onAvatarPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
      >
        {uploadingAvatar ? (
          <ActivityIndicator color="#263077" />
        ) : avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <User size={36} color="#333333" fill="#333333" />
        )}
        {!uploadingAvatar && <View style={styles.cameraBadge}><Camera size={13} color="#263077" /></View>}
      </TouchableOpacity>

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
    position: 'relative',
    overflow: 'visible',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E5EF',
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
