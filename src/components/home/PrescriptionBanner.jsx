import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Upload } from 'lucide-react-native';

const PrescriptionBanner = ({
  onUploadPress,
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
    minHeight: 92,
    paddingVertical: 18,
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

});

export default PrescriptionBanner;

