import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  StatusBar,
  ActivityIndicator,
  Image as NativeImage,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { Heart, ChevronUp, X } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ImageLoader = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.imageLoader} pointerEvents="none">
      <ActivityIndicator size="large" color="#263077" />
    </View>
  );
};

const ProductImageGallery = ({
  images,
  image,
  isFavorite = false,
  onFavPress,
  favLoading = false,
  onExpandPress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const prefetchedGalleryRef = React.useRef(null);

  // Support both `images` array (from API) and legacy single `image`
  const gallery =
    images && images.length > 0
      ? images
      : image
        ? [image]
        : [];

  const hasMultiple = gallery.length > 1;
  const galleryKey = gallery.join('|');

  useEffect(() => {
    setActiveIndex(0);
    setLoadedImages({});
    setFailedImages({});
    prefetchedGalleryRef.current = null;
  }, [galleryKey]);

  const markImageLoaded = index => {
    setLoadedImages(current => ({ ...current, [index]: true }));
    // Give the first image priority, then fetch the remaining gallery images
    // into the native image cache so swiping does not start a cold request.
    if (index === 0 && prefetchedGalleryRef.current !== galleryKey) {
      prefetchedGalleryRef.current = galleryKey;
      gallery.slice(1).forEach(uri => {
        if (typeof uri === 'string' && uri.length > 0) {
          NativeImage.prefetch(uri).catch(() => {});
        }
      });
    }
  };
  const markImageFailed = index => {
    setFailedImages(current => ({ ...current, [index]: true }));
    markImageLoaded(index);
  };

  const openFullscreen = (idx) => {
    setFullscreenIndex(idx);
    setFullscreenVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* ===== Fullscreen Image Modal ===== */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <StatusBar backgroundColor="rgba(0,0,0,0.95)" barStyle="light-content" />
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setFullscreenVisible(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={26} color="#fff" />
          </TouchableOpacity>
          <FlatList
            data={gallery}
            horizontal
            pagingEnabled
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={fullscreenIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(item, idx) => `full-${item}-${idx}`}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          />
          {hasMultiple && (
            <View style={styles.modalDots}>
              {gallery.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === fullscreenIndex ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>

      {/* ===== Image Area ===== */}
      <View style={styles.imageArea}>
        {gallery.length > 0 ? (
          <FlatList
            data={gallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            onMomentumScrollEnd={e => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setActiveIndex(idx);
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => openFullscreen(index)}
              >
                <Image
                  source={failedImages[index] ? require('../../assets/images/Subtract.png') : { uri: item }}
                  style={[
                    styles.image,
                    styles.pageImage,
                    loadedImages[index] ? styles.imageLoaded : styles.imageLoading,
                  ]}
                  resizeMode="cover"
                  onLoad={() => markImageLoaded(index)}
                  onError={() => markImageFailed(index)}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <TouchableOpacity activeOpacity={0.95} onPress={() => openFullscreen(0)}>
            <Image
              source={require('../../assets/images/Subtract.png')}
              style={[styles.image, loadedImages[0] ? styles.imageLoaded : styles.imageLoading]}
              resizeMode="cover"
              onLoad={() => markImageLoaded(0)}
              onError={() => markImageFailed(0)}
            />
          </TouchableOpacity>
        )}
        <ImageLoader visible={!loadedImages[activeIndex]} />

        {/* Dot indicators */}
        {hasMultiple && (
          <View style={styles.dotsContainer}>
            {gallery.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Heart Button (top-right) */}
        <TouchableOpacity
          style={styles.heartCircle}
          activeOpacity={0.85}
          onPress={onFavPress}
        >
          {favLoading ? (
            <ActivityIndicator size="small" color="#263077" />
          ) : (
            <Heart
              size={20}
              color={isFavorite ? '#ff0000' : '#263077'}
              fill={isFavorite ? '#ff0000' : 'none'}
            />
          )}
        </TouchableOpacity>

        {/* ===== Wave overlay at the bottom of image ===== */}
        <View style={styles.waveOverlay} pointerEvents="none">
          <Svg
            width="100%"
            height={54}
            viewBox="0 0 414 54"
            preserveAspectRatio="none"
          >
            <Path
              d="M0,54 C80,54 150,8 207,8 C264,8 334,54 414,54 Z"
              fill="#F5F5F5"
            />
          </Svg>
        </View>

        {/* Chevron on top of the wave peak */}
        <TouchableOpacity
          style={styles.chevronWrapper}
          activeOpacity={0.7}
          onPress={onExpandPress}
        >
          <ChevronUp size={22} color="#263077" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },

  /* ===== Fullscreen Modal ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 6,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  modalDots: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ===== Image Area ===== */
  imageArea: {
    width: '100%',
    height: 380,
    backgroundColor: '#F5F5F5',
    position: 'relative',
    // No overflow:hidden — so wave can bleed out at bottom
  },
  image: {
    height: 380,
  },
  pageImage: { width: SCREEN_WIDTH },
  imageLoaded: { opacity: 1 },
  imageLoading: { opacity: 0 },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 2,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#263077',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#ccc',
  },

  /* ===== Heart Circle ===== */
  heartCircle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CDDEE4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* ===== Wave Overlay ===== */
  waveOverlay: {
    position: 'absolute',
    bottom: -27,
    left: 0,
    right: 0,
    height: 54,
  },

  /* ===== Chevron ===== */
  chevronWrapper: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductImageGallery;
