import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Upload, Phone } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const PrescriptionBanner = ({
  phoneNumber = '1800-123-456',
  onUploadPress,
  onWhatsAppPress,
  onCallPress,
  uploading = false,
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
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={onUploadPress}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel={uploading ? 'Uploading prescription' : 'Upload prescription'}
        >
          {uploading
            ? <ActivityIndicator size="small" color="#273179" />
            : <Upload size={16} color="#273179" />}
          <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
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
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={onWhatsAppPress}
            accessibilityRole="button"
            accessibilityLabel="Open WhatsApp"
          >
            <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
              <Path
                fill="#FFFFFF"
                d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.34.2 11.89c0 2.1.55 4.14 1.59 5.95L.1 24l6.31-1.65a11.87 11.87 0 0 0 5.67 1.44h.01c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 0 0-3.46-8.42ZM12.09 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.64-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
              />
            </Svg>
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
    backgroundColor: '#25D366',
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
