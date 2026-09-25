import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../authcontext';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import StaticConst from '../../utils/StaticConst';

const { width } = Dimensions.get('window');

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = React.useContext(AuthContext);

  const { phone, mobile, otp: initialOtp } = route.params || {};
  const userPhone = phone || mobile || '';
  const mobileNumber = userPhone;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [GenOTP, setGenOTP] = useState(initialOtp || '');
  const [otploader, setOtploader] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (StaticConst.smsEnabled != 1 && initialOtp) {
      const otpStr = initialOtp.toString();
      const otpArray = otpStr.split('');
      setOtp(otpArray);
    }
    startTimer();
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const startTimer = () => {
    setOtpTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const resendOtp = () => {
    if (otpTimer > 0) return;
    const inputdata = new FormData();
    inputdata.append('user', userPhone);
    CommonService._callApi({
      api: '/login/otp',
      method: 'CONVERT',
      body: inputdata,
    })
      .then(r => r.json())
      .then(json => {
        if (json.status == 1) {
          setGenOTP(json.response.data.otp);
          setOtp(['', '', '', '', '', '']);
          startTimer();
          if (StaticConst.smsEnabled != 1) {
            const otpStr = json.response.data.otp.toString();
            const otpArray = otpStr.split('');
            setTimeout(() => setOtp(otpArray), 500);
          }
        }
      })
      .catch(() => {});
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (!enteredOtp || enteredOtp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    if (GenOTP && String(enteredOtp) !== String(GenOTP)) {
      alert('Invalid OTP. Please try again.');
      return;
    }
    setOtploader(true);
    const inputdata = new FormData();
    inputdata.append('user', userPhone);
    inputdata.append('otp', enteredOtp);
    CommonService._callApi({
      api: '/login/check',
      method: 'CONVERT',
      body: inputdata,
    })
      .then(r => r.json())
      .then(json => {
        setOtploader(false);
        if (json.status == 1) {
          store.dispatch({ type: 'SETAUTHUSER', payload: json.response.data });
          signIn(json.response.data);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          alert(
            'Verification Failed: ' + (json.response.message || 'Unable to verify OTP. Please try again.')
          );
        }
      })
      .catch(() => {
        setOtploader(false);
        alert('Something Went Wrong: Unable to process your request right now. Please try again later.');
      });
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
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
          <Text style={styles.subtitle}>Enter one time password send on</Text>

          {/* Mobile Number & Edit Button */}
          <View style={styles.mobileContainer}>
            <Text style={styles.mobileText}>91+ {mobileNumber}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  { borderColor: digit ? '#2CB7DF' : '#D5D5D5' },
                ]}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
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
              {otpTimer > 0 ? (
                <Text style={styles.timerText}>Wait {formatTimer(otpTimer)} to resend</Text>
              ) : (
                <TouchableOpacity onPress={resendOtp}>
                  <Text style={styles.resendText}>RESEND OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyOtp}
            disabled={otploader}
          >
            {otploader ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
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

  /* ================= SKIP ================= */
  skipButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#273179',
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
    width: (width - 48 - 40) / 6,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D5D5D5',
    borderRadius: 12,
    fontSize: 20,
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

  /* ================= VERIFY BUTTON ================= */
  verifyButton: {
    backgroundColor: '#2CB7DF',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#2CB7DF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default OtpScreen;
