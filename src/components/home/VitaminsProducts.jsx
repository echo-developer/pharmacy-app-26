import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_WIDTH = (width - 32 - CARD_GAP * 2) / 3;
const CARD_HEIGHT = 150;

const VitaminsProducts = ({ products = [], onCardPress }) => {
  const [previewItem, setPreviewItem] = useState(null);

  const handleCardPress = item => {
    if (Number(item.product_count) > 0) {
      onCardPress?.(item);
      return;
    }
    setPreviewItem(item);
  };

  return (
    <>
      <View style={styles.grid}>
        {products.map((item, index) => (
          <TouchableOpacity
            key={(item.product_id || item.category_id || item.id || index).toString()}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => handleCardPress(item)}
          >
            <LinearGradient
              colors={['#FED7D4', '#E0C763']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.34, 1]}
              style={styles.gradientBg}
            />
            <Text style={styles.cardLabel}>{item.label || item.category_name || item.name || item.product_name}</Text>
            {typeof item.image === 'string' && item.image && !item.image.includes('via.placeholder') ? (
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../assets/images/petsupplements.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={Boolean(previewItem)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewItem(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setPreviewItem(null)}
        >
          <View style={styles.previewCard}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close image preview"
              style={styles.closeButton}
              onPress={() => setPreviewItem(null)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            {previewItem?.image ? (
              <Image
                source={{ uri: previewItem.image }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : null}
            <Text style={styles.previewTitle}>
              {previewItem?.name || previewItem?.category_name || 'Vitamin category'}
            </Text>
            <Text style={styles.previewMessage}>No products available in this category yet.</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: CARD_GAP,
    marginTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 12,
  },
  cardLabel: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    fontSize: 15,
    fontWeight: '800',         // Bolder
    color: '#693410',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingTop: 2,
    lineHeight: 18,
    zIndex: 2,
  },
  cardImage: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: '94%',
    height: '70%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(20, 25, 45, 0.55)',
  },
  previewCard: {
    width: '100%',
    maxWidth: 360,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#252525',
    fontSize: 30,
    lineHeight: 34,
  },
  previewImage: {
    width: '100%',
    height: 210,
    marginTop: 12,
  },
  previewTitle: {
    marginTop: 14,
    color: '#252525',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewMessage: {
    marginTop: 6,
    color: '#787887',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default VitaminsProducts;
