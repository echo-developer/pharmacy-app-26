import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, MapPin, Plus, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import StaticConst from '../../utils/StaticConst';
import store from '../../store/store';

const AddressManageScreen = ({ navigation }) => {
  const currentAddress = store.getState().GlobalReducer.chosencity?.tempaddress?.address || 'Sector F, South Kolkata, 700107';

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      title: 'Home (Pincode 721401)',
      address: 'Plot 12, Contai, East Medinipur, 721401',
      pincode: '721401',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Kolkata Residence',
      address: 'Sector F, South Kolkata, 700107',
      pincode: '700107',
      isDefault: false,
    },
    {
      id: '3',
      title: 'Office',
      address: 'Plot 45, Salt Lake Sector V, Kolkata',
      pincode: '700091',
      isDefault: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState('1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPincode, setNewPincode] = useState('721401');

  const handleSelectAddress = async (item) => {
    setSelectedId(item.id);
    const payloadData = {
      tempaddress: {
        address: item.address,
        postalcode: item.pincode,
        place_id: item.id,
      },
    };
    store.dispatch({
      type: 'SETCITY',
      payload: payloadData,
    });
    try {
      await AsyncStorage.setItem(
        StaticConst.sessionkey.city,
        base64.encode(JSON.stringify(payloadData))
      );
    } catch (e) {
      console.log('Error persisting city:', e);
    }
    Alert.alert('Location Updated', `Location set to Pincode ${item.pincode}`);
  };

  const handleSaveAddress = () => {
    if (!newAddress || !newPincode) {
      Alert.alert('Incomplete Address', 'Please fill address and pincode');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      title: newTitle || 'Other',
      address: newAddress,
      pincode: newPincode,
      isDefault: false,
    };
    setAddresses([...addresses, newEntry]);
    setShowAddForm(false);
    setNewTitle('');
    setNewAddress('');
    setNewPincode('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#043250" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ADD NEW ADDRESS BTN */}
        <TouchableOpacity
          style={styles.addAddressBtn}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} color="#2CB7DF" style={{ marginRight: 8 }} />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>

        {/* ADD FORM */}
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Address Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Tag (Home, Office, Other)"
              placeholderTextColor="#787C77"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Full Address (House No, Building, Street)"
              placeholderTextColor="#787C77"
              multiline
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="#787C77"
              keyboardType="number-pad"
              maxLength={6}
              value={newPincode}
              onChangeText={setNewPincode}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress}>
              <Text style={styles.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ADDRESS LIST */}
        <Text style={styles.sectionTitle}>Saved Addresses</Text>
        {addresses.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.addressCard,
              selectedId === item.id && styles.addressCardSelected,
            ]}
            onPress={() => handleSelectAddress(item)}
          >
            <View style={styles.iconCircle}>
              <MapPin size={18} color={selectedId === item.id ? '#2CB7DF' : '#787887'} />
            </View>

            <View style={styles.addressInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.addressTag}>{item.title}</Text>
                {selectedId === item.id && (
                  <View style={styles.activeBadge}>
                    <Check size={12} color="#FFFFFF" />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{item.address}</Text>
              <Text style={styles.pincodeText}>Pincode: {item.pincode}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(44, 183, 223, 0.1)',
    borderWidth: 1.5,
    borderColor: '#2CB7DF',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  addAddressText: {
    color: '#2CB7DF',
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F4F5FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#043250',
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#2CB7DF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#043250',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  addressCardSelected: {
    borderColor: '#2CB7DF',
    backgroundColor: 'rgba(44, 183, 223, 0.04)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addressTag: {
    fontSize: 14,
    fontWeight: '700',
    color: '#043250',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#709D2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },
  addressText: {
    fontSize: 13,
    color: '#787887',
    lineHeight: 18,
    marginBottom: 4,
  },
  pincodeText: {
    fontSize: 12,
    color: '#263077',
    fontWeight: '600',
  },
});

export default AddressManageScreen;
