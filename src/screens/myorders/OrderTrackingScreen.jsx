import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import OrderTrackingTimeline from '../../components/orderdetails/OrderTrackingTimeline';

const OrderTrackingScreen = ({ navigation, route }) => {
  const statusdetails = route?.params?.statusdetails || [];
  const orderId = route?.params?.orderId;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Dark overlay — tapping closes the screen */}
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet panel */}
      <View style={styles.sheetWrapper}>
        {/* Floating close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <X size={20} color="#333333" strokeWidth={3} />
        </TouchableOpacity>

        {/* Sheet content */}
        <SafeAreaView style={styles.sheetContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <OrderTrackingTimeline statusdetails={statusdetails} orderId={orderId} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheetWrapper: {
    alignItems: 'center',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  sheetContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    // SafeAreaView handles bottom safe area automatically
  },
});

export default OrderTrackingScreen;
