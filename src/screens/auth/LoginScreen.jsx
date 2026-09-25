import React, { useState } from 'react';
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
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonService from '../../utils/CommonService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleGetOtp = () => {
    if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!isChecked) {
      alert('Please agree to the Terms of Use & Privacy Policy');
      return;
    }
    Keyboard.dismiss();
    setLoader(true);
    const inputdata = new FormData();
    inputdata.append('user', mobile);
    CommonService._callApi({
      api: '/login/otp',
      method: 'CONVERT',
      body: inputdata,
    })
      .then(r => r.json())
      .then(json => {
        setLoader(false);
        if (json.status == 1) {
          navigation.navigate('Otp', {
            phone: mobile,
            mobile: mobile,
            otp: json.response.data.otp,
          });
        } else {
          alert(
            'Login Failed: ' + (json.response.message || 'Unable to continue. Please try again.')
          );
        }
      })
      .catch(() => {
        setLoader(false);
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
      <StatusBar barStyle="light-content" backgroundColor="#263077" translucent />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ================= TOP SECTION ================= */}
        <LinearGradient
          colors={['#263077', '#364193']} 
          style={styles.topSection}
        >
          {/* Skip Button - UPDATED with onPress */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Offer Text */}
          <View style={styles.offerTextContainer}>
            <Text style={styles.offerText}>
              Save{'\n'}Up to <Text style={styles.offerHighlight}>51%</Text>
            </Text>
            
            {/* Lines around ON ORDERING */}
            <View style={styles.lineContainer}>
              <View style={styles.line} />
              <Text style={styles.onOrderingText}>ON ORDERING</Text>
              <View style={styles.line} />
            </View>

            {/* Branded Substitutes Tab */}
            <View style={styles.brandedTab}>
              <View style={styles.shieldContainer}>
                <View style={styles.shieldGlow}>
                  <View style={styles.shieldIcon}>
                    <Text style={styles.shieldCheck}>✓</Text>
                  </View>
                </View>
              </View>
              <View style={styles.brandedTextContainer}>
                <Text style={styles.brandedTitle}>Branded Substitutes</Text>
                <Text style={styles.brandedSubtitle}>Medicines</Text>
              </View>
            </View>
          </View>

          {/* Medicine Bag Image */}
          <Image
            source={require('../../assets/images/Subtract.png')}
            style={styles.medicineImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* ================= BOTTOM SECTION ================= */}
        <LinearGradient
          colors={['#FFFFFF', '#F4F5FF']} 
          style={styles.bottomSection}
        >
          <Text style={styles.title}>Login / Sign up</Text>
          <Text style={styles.subtitle}>Enter your 10 digits mobile numbers</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>91+</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#4F514E"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <TouchableOpacity style={styles.otpButton} onPress={handleGetOtp} disabled={loader}>
            {loader ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.otpButtonText}>Get OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, isChecked && styles.checkboxChecked]}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <Text style={styles.checkboxTick}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By signing, I agree to the{' '}
              <Text style={styles.linkText}>Terms of Use</Text> &{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... styles remain exactly the same as your original file ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#263077', 
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    height: 360,                    
    paddingHorizontal: 24,
    paddingTop: 40,
    position: 'relative',
    borderBottomLeftRadius: 0,      
    borderBottomRightRadius: 0,
  },
  skipButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', 
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  offerTextContainer: {
    marginTop: 20,
    maxWidth: '55%',
  },
  offerText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  offerHighlight: {
    fontSize: 42,
    marginTop: -10, 
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18, 
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  onOrderingText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  brandedTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,       
    paddingVertical: 12,         
    borderTopRightRadius: 16,    
    borderBottomRightRadius: 16, 
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftWidth: 0,          
    alignSelf: 'flex-start',
    marginLeft: -24,             
  },
  shieldContainer: {
    marginRight: 12,             
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldGlow: {
    width: 36,                   
    height: 36,                  
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.2)', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    width: 26,                   
    height: 26,                  
    backgroundColor: '#4CAF50', 
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomLeftRadius: 13, 
    borderBottomRightRadius: 13, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  shieldCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16, 
    marginTop: 0,  
    textAlign: 'center',
  },
  brandedTextContainer: {
    flexDirection: 'column',
  },
  brandedTitle: {
    color: '#FFFFFF',
    fontSize: 14,                
    fontWeight: '700',
  },
  brandedSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,                
    fontWeight: '400',
    marginTop: 2,                
  },
  medicineImage: {
    position: 'absolute',
    right: -50,                     
    top: 95,                       
    width: width * 0.62,            
    height: 220,                    
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderTopLeftRadius: 28,        
    borderTopRightRadius: 28,
    marginTop: -60,                 
    minHeight: 480,                 
    zIndex: 2,                      
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#043250',
  },
  subtitle: {
    fontSize: 14,
    color: '#787887',
    marginTop: 8,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A3A02',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#043250', 
  },
  otpButton: {
    backgroundColor: '#2CB7DF',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#2CB7DF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#043250',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#043250',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#787C77',
    lineHeight: 18,
  },
  linkText: {
    color: '#273179',
    fontWeight: '600',
  },
});

export default LoginScreen;