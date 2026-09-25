import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { ArrowLeft, ShieldCheck, FileText, HelpCircle, Info } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';

const WebScreen = ({ navigation }) => {
  const route = useRoute();
  const { title = 'Information', type = 'info' } = route.params || {};

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <View>
            <View style={styles.iconCenterHeader}>
              <Info size={40} color="#2CB7DF" />
              <Text style={styles.contentHeading}>About Pharmacy App</Text>
            </View>
            <Text style={styles.paragraph}>
              Pharmacy App is your trusted digital healthcare companion, bringing genuine medicines, healthcare products, and wellness essentials right to your doorstep.
            </Text>
            <Text style={styles.paragraph}>
              We partner directly with licensed pharmacies and certified medical suppliers to ensure 100% authentic medicines with fast 30-minute delivery.
            </Text>
          </View>
        );
      case 'faq':
        return (
          <View>
            <Text style={styles.contentHeading}>Frequently Asked Questions</Text>

            <Text style={styles.qTitle}>Q: How long does delivery take?</Text>
            <Text style={styles.paragraph}>
              Standard express delivery usually takes between 30 to 45 minutes depending on your location.
            </Text>

            <Text style={styles.qTitle}>Q: Are the medicines genuine?</Text>
            <Text style={styles.paragraph}>
              Yes, all medicines and healthcare supplies come directly from registered distributor channels and verified pharmacists.
            </Text>

            <Text style={styles.qTitle}>Q: Do I need a prescription?</Text>
            <Text style={styles.paragraph}>
              Prescription-required (Rx) medicines require an uploaded prescription during ordering.
            </Text>
          </View>
        );
      case 'privacy':
        return (
          <View>
            <View style={styles.iconCenterHeader}>
              <ShieldCheck size={40} color="#709D2A" />
              <Text style={styles.contentHeading}>Privacy Policy</Text>
            </View>
            <Text style={styles.paragraph}>
              Your privacy and medical data confidentiality are paramount to us. We adhere to international security standards for health data protection.
            </Text>
            <Text style={styles.paragraph}>
              We never share your personal details, order history, or prescription documents with unauthorized third parties.
            </Text>
          </View>
        );
      default:
        return (
          <View>
            <View style={styles.iconCenterHeader}>
              <FileText size={40} color="#263077" />
              <Text style={styles.contentHeading}>{title}</Text>
            </View>
            <Text style={styles.paragraph}>
              For returns, cancellations, or refund inquiries, please contact our 24/7 customer support line or submit a request directly through your order tracking screen.
            </Text>
            <Text style={styles.paragraph}>
              Opened or unsealed healthcare products cannot be returned due to safety and health regulations.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>{renderContent()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  iconCenterHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
    marginTop: 8,
    marginBottom: 12,
  },
  qTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263077',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#787887',
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default WebScreen;
