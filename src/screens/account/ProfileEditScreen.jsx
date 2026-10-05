import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { AuthContext } from '../../authcontext';
import CommonService from '../../utils/CommonService';
import StaticConst from '../../utils/StaticConst';
import store from '../../store/store';

const ProfileEditScreen = ({ navigation }) => {
  const { loginState } = useContext(AuthContext);
  const user = store.getState().GlobalReducer.authuser || loginState?.userToken || {};
  const [name, setName] = useState(user.member_name || user.name || '');
  const [email, setEmail] = useState(user.member_email || user.email || '');
  const [gender, setGender] = useState(user.member_gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(user.member_dob || '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!name.trim()) return Alert.alert('Name required', 'Enter your name to continue.');
    setBusy(true);
    const form = new FormData();
    form.append('member_name', name.trim());
    form.append('member_email', email.trim());
    form.append('member_gender', gender);
    form.append('member_dob', dateOfBirth.trim());
    try {
      const response = await CommonService._callApi({ api: '/member/save_profile', method: 'CONVERT', body: form }).then(r => r.json());
      if (response.status != 1) throw new Error(response.response?.message || 'Could not save your profile.');
      // The API returns the canonical profile (including member_code, wallet, logo and phone).
      const savedProfile = response.response?.data;
      const nextUser = {
        ...user,
        ...(savedProfile && typeof savedProfile === 'object' ? savedProfile : {}),
        member_name: savedProfile?.member_name ?? name.trim(),
        member_email: savedProfile?.member_email ?? email.trim(),
        member_gender: savedProfile?.member_gender ?? gender,
        member_dob: savedProfile?.member_dob ?? dateOfBirth.trim(),
      };
      await AsyncStorage.setItem(StaticConst.userauth.key, base64.encode(JSON.stringify(nextUser)));
      store.dispatch({ type: 'SETAUTHUSER', payload: nextUser });
      Alert.alert('Profile saved', 'Your profile has been updated.', [{ text: 'Done', onPress: () => navigation.goBack() }]);
    } catch (error) { Alert.alert('Could not save', error.message || 'Please try again.'); }
    finally { setBusy(false); }
  };
  return <View style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#fff"/><View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color="#263077"/></TouchableOpacity><Text style={styles.title}>Edit profile</Text></View><ScrollView contentContainerStyle={styles.content}><Text style={styles.note}>Your mobile number is linked to your account and cannot be changed here.</Text><Text style={styles.label}>Full name</Text><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name"/><Text style={styles.label}>Email</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none"/><Text style={styles.label}>Gender</Text><View style={styles.gender}>{[['M','Male'],['F','Female'],['O','Other']].map(([key,label])=><TouchableOpacity key={key} style={[styles.genderOption,gender===key&&styles.selected]} onPress={() => setGender(gender===key?'':key)}><Text style={[styles.genderText,gender===key&&styles.selectedText]}>{label}</Text></TouchableOpacity>)}</View><Text style={styles.label}>Date of birth</Text><TextInput style={styles.input} value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" maxLength={10}/><TouchableOpacity style={styles.save} onPress={save} disabled={busy}>{busy?<ActivityIndicator color="#fff"/>:<><Save size={17} color="#fff"/><Text style={styles.saveText}>Save profile</Text></>}</TouchableOpacity></ScrollView></View>;
};
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#F7F8FC'},header:{paddingTop:48,paddingBottom:16,paddingHorizontal:16,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#ECEEF4'},back:{padding:6,marginRight:10},title:{fontSize:20,fontWeight:'700',color:'#18204F'},content:{padding:18},note:{fontSize:13,color:'#676C7F',lineHeight:19,backgroundColor:'#EEF0FA',padding:12,borderRadius:10,marginBottom:20},label:{fontSize:13,fontWeight:'700',color:'#3D425B',marginBottom:7,marginTop:12},input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#E2E5EF',borderRadius:10,paddingHorizontal:13,paddingVertical:12,fontSize:15,color:'#20243A'},gender:{flexDirection:'row',gap:8},genderOption:{flex:1,borderWidth:1,borderColor:'#E2E5EF',borderRadius:9,paddingVertical:12,alignItems:'center',backgroundColor:'#fff'},selected:{borderColor:'#263077',backgroundColor:'#EEF0FA'},genderText:{fontSize:13,color:'#555B70'},selectedText:{fontWeight:'700',color:'#263077'},save:{marginTop:28,backgroundColor:'#263077',borderRadius:10,padding:14,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},saveText:{fontWeight:'700',fontSize:15,color:'#fff'}});
export default ProfileEditScreen;
