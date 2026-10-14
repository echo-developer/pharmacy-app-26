import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const FastImageWithShimmer = ({
  source,
  style,
  shimmerStyle,
  shimmerColor = '#EAEAEA',
  shimmerBackgroundColor = '#F5F5F5',
  resizeMode = 'contain',
  children,
  onLoadEnd,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
    if (onLoadEnd) onLoadEnd();
  };

  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View style={style}>
      {isLoading && (
        <ShimmerPlaceholder
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }, shimmerStyle]}
          shimmerColor={shimmerColor}
          shimmerBackgroundColor={shimmerBackgroundColor}
          visible={false}
        />
      )}
      <FastImage
        source={imageSource}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        onLoadEnd={handleLoadEnd}
        {...props}
      />
      {children}
    </View>
  );
};

export const FastImageBackground = ({
  source,
  style,
  children,
  shimmerColor = '#EAEAEA',
  shimmerBackgroundColor = '#F5F5F5',
  resizeMode = 'cover',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View style={style}>
      {isLoading && (
        <ShimmerPlaceholder
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          shimmerColor={shimmerColor}
          shimmerBackgroundColor={shimmerBackgroundColor}
          visible={false}
        />
      )}
      <FastImage
        source={imageSource}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        onLoadEnd={() => setIsLoading(false)}
        {...props}
      />
      {children}
    </View>
  );
};

export default React.memo(FastImageWithShimmer);
