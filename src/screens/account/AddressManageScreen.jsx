import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, MapPin, Plus, Check, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import StaticConst from '../../utils/StaticConst';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';

const AddressManageScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loader, setLoader] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const fetchAddresses = async () => {
    setLoader(true);

    const currentCity = store.getState().GlobalReducer.chosencity;
    const currentPlaceId = currentCity?.tempaddress?.place_id;

    const localActive = currentPlaceId ? [{
      place_id: currentPlaceId,
      place_address: currentCity.tempaddress.address,
      place_pincode: currentCity.tempaddress.postalcode,
      place_type_name: 'Home',
    }] : [];

    CommonService._callApi({
      api: '/member/address',
      method: 'GET',
    })
      .then(resp => {
        setLoader(false);
        if (resp.data.status == 1 && Array.isArray(resp.data.response.data) && resp.data.response.data.length > 0) {
          const list = resp.data.response.data;
          setAddresses(list);

          // Check if the currently stored place_id matches any real backend address
          const validMatch = currentPlaceId
            ? list.find(a => String(a.place_id) === String(currentPlaceId))
            : null;

          if (validMatch) {
            // Stored address is valid — keep it selected in UI
            setSelectedId(currentPlaceId);
          } else {
            // Stored address_id is missing or stale (e.g. random fallback ID) —
            // auto-select the first real address from the backend so placeorder works
            handleSelectAddress(list[0]);
          }
        } else {
          setAddresses(localActive);
          if (localActive.length > 0) {
            setSelectedId(localActive[0].place_id);
          }
        }
      })
      .catch(err => {
        setLoader(false);
        setAddresses(localActive);
        if (localActive.length > 0) {
          setSelectedId(localActive[0].place_id);
        }
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const saveAddressToStore = async (item) => {
    const payloadData = {
      tempaddress: {
        address: item.place_address || item.address || '',
        postalcode: item.place_pincode || item.pincode || '',
        place_id: item.place_id || item.id,
      },
    };
    store.dispatch({ type: 'SETCITY', payload: payloadData });
    try {
      await AsyncStorage.setItem(
        StaticConst.sessionkey.city,
        base64.encode(JSON.stringify(payloadData))
      );
    } catch (e) {
      console.log('Error persisting city:', e);
    }
  };

  const handleSelectAddress = async (item) => {
    const id = item.place_id || item.id;
    setSelectedId(id);
    await saveAddressToStore(item);
  };

  const handleSelectAndGoBack = async (item) => {
    await handleSelectAddress(item);
    Alert.alert('Address Selected', `Delivering to: ${item.place_address || item.address}`);
  };

  const handleSaveAddress = () => {
    if (!newAddress.trim() || !newPincode.trim()) {
      Alert.alert('Incomplete', 'Please fill address and pincode');
      return;
    }
    setSaving(true);
    const inputdata = new FormData();
    inputdata.append('place_address', newAddress.trim());
    inputdata.append('place_pincode', newPincode.trim());
    inputdata.append('place_type_name', newTitle.trim() || 'Home');
    inputdata.append('contact_phone', newPhone.trim() || '');
    inputdata.append('member_id', store.getState().GlobalReducer.authuser?.member_id || '');

    CommonService._callApi({
      api: '/member/addaddress',
      method: 'CONVERT',
      body: inputdata,
    })
      .then(r => r.json())
      .then(async resp => {
        console.log('ADD ADDRESS RESP:', JSON.stringify(resp));
        setSaving(false);
        setShowAddForm(false);
        setNewTitle(''); setNewAddress(''); setNewPincode(''); setNewPhone('');

        // Try to get the real place_id from the API response
        // Backend may return it at various paths — check all of them
        const realPlaceId =
          resp.response?.data?.place_id ||
          resp.response?.data?.id ||
          resp.response?.place_id ||
          resp.response?.id ||
          null;

        if (realPlaceId) {
          // We have a real DB id — save it directly and re-fetch to refresh the list
          const createdItem = {
            place_id: realPlaceId,
            place_address: newAddress.trim(),
            place_pincode: newPincode.trim(),
            place_type_name: newTitle.trim() || 'Home',
          };
          await saveAddressToStore(createdItem);
        }

        // Always re-fetch so the list reflects the actual backend state.
        // fetchAddresses will auto-select the first address if the stored
        // place_id doesn't match any real backend address.
        fetchAddresses();
      })
      .catch(async err => {
        console.log('ADD ADDRESS ERROR:', err?.message);
        setSaving(false);
        setShowAddForm(false);
        setNewTitle(''); setNewAddress(''); setNewPincode(''); setNewPhone('');
        // Re-fetch to get the real addresses — the add may have succeeded
        fetchAddresses();
      });
  };

  const handleDeleteAddress = (item) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            const inputdata = new FormData();
            inputdata.append('id', item.place_id || item.id);
            CommonService._callApi({
              api: '/member/removeaddress',
              method: 'CONVERT',
              body: inputdata,
            })
              .then(r => r.json())
              .then(resp => {
                if (resp.status == 1) fetchAddresses();
              })
              .catch(() => { });
          },
        },
      ]
    );
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
          onPress={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} color="#2CB7DF" style={{ marginRight: 8 }} />
          <Text style={styles.addAddressText}>
            {showAddForm ? 'Cancel' : 'Add New Address'}
          </Text>
        </TouchableOpacity>

        {/* ADD FORM */}
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Tag (Home, Office, Other)"
              placeholderTextColor="#B0B0B0"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              placeholder="Full Address (House No, Street, Area)"
              placeholderTextColor="#B0B0B0"
              multiline
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="#B0B0B0"
              keyboardType="number-pad"
              maxLength={6}
              value={newPincode}
              onChangeText={setNewPincode}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#B0B0B0"
              keyboardType="phone-pad"
              maxLength={10}
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSaveAddress}
              disabled={saving}>
              {saving
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.saveBtnText}>Save Address</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* ADDRESS LIST */}
        <Text style={styles.sectionTitle}>Saved Addresses</Text>

        {loader ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2CB7DF" />
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyBox}>
            <MapPin size={40} color="#CCCCCC" />
            <Text style={styles.emptyText}>No saved addresses</Text>
            <Text style={styles.emptySubText}>Add an address to continue</Text>
          </View>
        ) : (
          addresses.map((item) => {
            const id = item.place_id || item.id;
            const isSelected = selectedId == id;
            const addressText = item.place_address || item.address || '';
            const pincode = item.place_pincode || item.pincode || '';
            const tag = item.place_type_name || 'Address';

            return (
              <TouchableOpacity
                key={String(id)}
                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                onPress={() => handleSelectAndGoBack(item)}>

                <View style={styles.iconCircle}>
                  <MapPin size={18} color={isSelected ? '#2CB7DF' : '#787887'} />
                </View>

                <View style={styles.addressInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.addressTag}>{tag}</Text>
                    {isSelected && (
                      <View style={styles.activeBadge}>
                        <Check size={12} color="#FFFFFF" />
                        <Text style={styles.activeText}>Selected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText}>{addressText}</Text>
                  {pincode ? <Text style={styles.pincodeText}>Pincode: {pincode}</Text> : null}
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteAddress(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
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
  backBtn: { padding: 6, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#043250' },
  scrollContent: { padding: 16 },
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
  addAddressText: { color: '#2CB7DF', fontSize: 14, fontWeight: '700' },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#043250', marginBottom: 12 },
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
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#043250', marginBottom: 12 },
  loaderBox: { paddingVertical: 40, alignItems: 'center' },
  emptyBox: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#787887', marginTop: 12 },
  emptySubText: { fontSize: 13, color: '#B0B0B0', marginTop: 4 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  addressCardSelected: {
    borderColor: '#2CB7DF',
    backgroundColor: 'rgba(44, 183, 223, 0.04)',
  },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F4F5FF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  addressInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addressTag: { fontSize: 14, fontWeight: '700', color: '#043250' },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#709D2A',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10,
  },
  activeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', marginLeft: 3 },
  addressText: { fontSize: 13, color: '#787887', lineHeight: 18, marginBottom: 2 },
  pincodeText: { fontSize: 12, color: '#263077', fontWeight: '600' },
  deleteBtn: { padding: 6, marginLeft: 8 },
});

export default AddressManageScreen;
