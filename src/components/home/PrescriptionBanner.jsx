import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Upload, Phone } from 'lucide-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const PrescriptionBanner = ({
  phoneNumber = '091234567890',
  onUploadPress,
  onWhatsAppPress,
  onCallPress,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== TOP SECTION ===== */}
      <View style={styles.topRow}>
        {/* Rx Icon Box */}
        <View style={styles.rxBox}>
          <FileText size={22} color="#76BA76" />
          <Text style={styles.rxText}>Rx</Text>
        </View>

        {/* Text Column */}
        <View style={styles.textColumn}>
          <Text style={styles.title}>Add Prescription</Text>
          <Text style={styles.subtitle}>to place your order</Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={onUploadPress}>
          <Upload size={16} color="#273179" />
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* ===== DOTTED LINE ===== */}
      <View style={styles.dottedLine} />

      {/* ===== BOTTOM SECTION ===== */}
      <View style={styles.bottomRow}>
        <Text style={styles.phoneText}>
          WhatsApp or call us on{' '}
          <Text style={styles.phoneNumberBold}>{phoneNumber}</Text>
        </Text>

        <View style={styles.iconRow}>
          {/* WhatsApp Button with Real Icon */}
          <TouchableOpacity style={styles.whatsappButton} onPress={onWhatsAppPress}>
            <FontAwesome5 name="whatsapp" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.callButton} onPress={onCallPress}>
            <Phone size={18} color="#273179" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== TOP ROW ===== */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rxBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rxText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#76BA76',
    marginTop: -2,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#273179',
  },
  subtitle: {
    fontSize: 12,
    color: '#787887',
    marginTop: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#273179',
    marginLeft: 6,
  },

  /* ===== DOTTED LINE ===== */
  dottedLine: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderStyle: 'dashed',
    marginVertical: 12,
    borderRadius: 1,
  },

  /* ===== BOTTOM ROW ===== */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneText: {
    flex: 1,
    fontSize: 12,
    color: '#787887',
    marginRight: 10,
  },
  phoneNumberBold: {
    fontWeight: '700',
    color: '#273179',         // Bold number ko thora dark kiya taaki stand out kare
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#65DC91',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PrescriptionBanner;