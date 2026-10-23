import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StrikethroughPrice = ({
  amount,
  label = 'MRP',
  fontSize = 11,
  color = '#949494',
  style,
}) => {
  const lineHeight = fontSize * 1.35;

  return (
    <View style={[styles.row, style]}>
      {label ? <Text style={{ fontSize, lineHeight, color }}>{label} </Text> : null}
      <View style={styles.amountWrap}>
        <Text style={{ fontSize, lineHeight, color }}>{amount}</Text>
        <View
          pointerEvents="none"
          style={[
            styles.line,
            { top: lineHeight * 0.52, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  amountWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    zIndex: 2,
  },
});

export default StrikethroughPrice;
