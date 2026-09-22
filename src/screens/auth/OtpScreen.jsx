import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation, route }) => {
  const mobileNumber = route?.params?.mobile || '981234567802';

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    // Static for now, no dynamic timer
    console.log('OTP Resent');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardContainer}
      >
        <View style={styles.contentContainer}>
          
          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/images/lock.png')}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Verify your OTP</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Enter one time password send on
          </Text>

          {/* Mobile Number & Edit Button */}
          <View style={styles.mobileContainer}>
            <Text style={styles.mobileText}>91+ {mobileNumber}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  { borderColor: digit ? '#2CB7DF' : '#D5D5D5' } 
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                placeholderTextColor="#D5D5D5"
              />
            ))}
          </View>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.noOtpText}>Didn't receive OTP?</Text>
            
            <View style={styles.timerRow}>
              <Text style={styles.timerText}>Wait 53 secs to </Text>
              
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>
                  RESEND OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', 
  },
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60, 
  },
  
  /* ================= ICON ================= */
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2CB7DF', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  /* ================= TEXT ================= */
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#787887',
    marginBottom: 16,
  },

  /* ================= MOBILE & EDIT ================= */
  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  mobileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#273179',
    marginRight: 12,
  },
  editButton: {
    backgroundColor: '#2CB7DF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* ================= OTP BOXES ================= */
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpBox: {
    width: (width - 48 - 36) / 4, 
    height: 60,
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5,
    borderColor: '#D5D5D5',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#043250',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  /* ================= RESEND SECTION ================= */
  resendContainer: {
    marginTop: 10,
  },
  noOtpText: {
    fontSize: 14,
    color: '#787887',
    marginBottom: 6,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#787887',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#273179',
  },
});

export default OtpScreen;