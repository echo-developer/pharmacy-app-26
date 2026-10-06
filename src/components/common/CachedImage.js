import React from 'react';
import {
  Image as NativeImage,
  ImageBackground as NativeImageBackground,
  Platform,
} from 'react-native';

const cacheRemoteSource = source => {
  if (Array.isArray(source)) return source.map(cacheRemoteSource);
  if (source && typeof source === 'object' && typeof source.uri === 'string') {
    return { ...source, cache: source.cache || 'force-cache' };
  }
  return source;
};

const getResizeMethod = resizeMethod =>
  resizeMethod || (Platform.OS === 'android' ? 'resize' : undefined);

export const CachedImage = React.memo(({ source, resizeMethod, fadeDuration = 100, ...props }) => (
  <NativeImage
    {...props}
    source={cacheRemoteSource(source)}
    resizeMethod={getResizeMethod(resizeMethod)}
    fadeDuration={fadeDuration}
  />
));

export const CachedImageBackground = React.memo(({
  source,
  resizeMethod,
  fadeDuration = 100,
  ...props
}) => (
  <NativeImageBackground
    {...props}
    source={cacheRemoteSource(source)}
    resizeMethod={getResizeMethod(resizeMethod)}
    fadeDuration={fadeDuration}
  />
));
