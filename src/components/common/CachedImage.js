import React from 'react';
import {
  Image as NativeImage,
  ImageBackground as NativeImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const cacheRemoteSource = source => {
  if (Array.isArray(source)) return source.map(cacheRemoteSource);
  if (source && typeof source === 'object' && typeof source.uri === 'string') {
    return { ...source, cache: source.cache || 'force-cache' };
  }
  return source;
};

const getResizeMethod = resizeMethod =>
  resizeMethod || (Platform.OS === 'android' ? 'resize' : undefined);

const getSourceKey = source => {
  if (typeof source === 'number') return String(source);
  if (Array.isArray(source)) return source.map(getSourceKey).join('|');
  return source?.uri || '';
};

const ImageSkeleton = ({ visible }) => visible ? (
  <ShimmerPlaceholder
    width={1}
    height={1}
    style={[StyleSheet.absoluteFill, styles.skeletonFill]}
    shimmerColors={['#ECEFF3', '#F5F6F8', '#ECEFF3']}
    visible={false}
  />
) : null;

export const CachedImage = React.memo(({ source, resizeMethod, fadeDuration = 100, style, onLoad, onError, ...props }) => {
  const sourceKey = getSourceKey(source);
  const [loading, setLoading] = React.useState(Boolean(sourceKey));

  React.useEffect(() => {
    setLoading(Boolean(sourceKey));
  }, [sourceKey]);

  return (
    <View style={[style, styles.imageContainer]}>
      <ImageSkeleton visible={loading} />
      <NativeImage
        {...props}
        source={cacheRemoteSource(source)}
        style={StyleSheet.absoluteFill}
        resizeMethod={getResizeMethod(resizeMethod)}
        fadeDuration={fadeDuration}
        onLoad={event => {
          setLoading(false);
          onLoad?.(event);
        }}
        onError={event => {
          setLoading(false);
          onError?.(event);
        }}
      />
    </View>
  );
});

export const CachedImageBackground = React.memo(({
  source,
  resizeMethod,
  fadeDuration = 100,
  style,
  children,
  onLoad,
  onError,
  ...props
}) => {
  const sourceKey = getSourceKey(source);
  const [loading, setLoading] = React.useState(Boolean(sourceKey));

  React.useEffect(() => {
    setLoading(Boolean(sourceKey));
  }, [sourceKey]);

  return (
    <View style={[style, styles.imageContainer]}>
      <ImageSkeleton visible={loading} />
      <NativeImageBackground
        {...props}
        source={cacheRemoteSource(source)}
        style={StyleSheet.absoluteFill}
        resizeMethod={getResizeMethod(resizeMethod)}
        fadeDuration={fadeDuration}
        onLoad={event => {
          setLoading(false);
          onLoad?.(event);
        }}
        onError={event => {
          setLoading(false);
          onError?.(event);
        }}
      >
        {children}
      </NativeImageBackground>
    </View>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  skeletonFill: {
    width: '100%',
    height: '100%',
  },
});
