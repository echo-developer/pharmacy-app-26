import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import CommonService from '../../utils/CommonService';
import store from '../../store/store';
import { AuthContext } from '../../authcontext';

const getApiErrorMessage = response => {
  const detail = response?.detail || response?.response?.detail;
  const validationMessage = Array.isArray(detail)
    ? detail.map(error => error?.msg).filter(Boolean).join('\n')
    : typeof detail === 'string' ? detail : '';
  return response?.response?.message
    || response?.response?.data?.message
    || response?.message
    || validationMessage
    || 'Could not send your message. Please try again.';
};

const ContactSupportScreen = ({ navigation }) => {
  const { loginState } = useContext(AuthContext);
  const user = store.getState().GlobalReducer.authuser || loginState?.userToken || {};
  const [name, setName] = useState(user.member_name || '');
  const [email, setEmail] = useState(user.member_email || '');
  const [inquiry, setInquiry] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !inquiry.trim() || !description.trim()) {
      Alert.alert('Details required', 'Please complete your name, email, inquiry and message.');
      return;
    }
    setBusy(true);
    const form = new FormData();
    form.append('name', name.trim());
    form.append('email', email.trim());
    form.append('inquiry', inquiry.trim());
    form.append('subject', subject.trim());
    form.append('description', description.trim());
    // attachment is an optional UploadFile; omitting it is valid, while an
    // empty string is sent as text and fails backend file validation.
    try {
      const response = await CommonService._callApi({ api: '/cms/contact', method: 'CONVERT', body: form }).then(r => r.json());
      const result = response?.response?.data;
      const succeeded = Number(response?.status ?? response?.response?.status) === 1
        || Number(result?.ok) === 1;
      if (!succeeded) throw new Error(getApiErrorMessage(response));
      Alert.alert('Message sent', response.response?.message || 'Thanks! Our team will get back to you soon.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Could not send', error.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <View style={styles.page}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color="#263077" /></TouchableOpacity>
      <Text style={styles.title}>Need Help?</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>Send us your question and our support team will get back to you.</Text>
      <Text style={styles.label}>Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" />
      <Text style={styles.label}>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Inquiry *</Text>
      <TextInput style={styles.input} value={inquiry} onChangeText={setInquiry} placeholder="What do you need help with?" />
      <Text style={styles.label}>Subject</Text>
      <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Subject (optional)" />
      <Text style={styles.label}>Message *</Text>
      <TextInput style={[styles.input, styles.message]} value={description} onChangeText={setDescription} placeholder="Describe your question or issue" multiline textAlignVertical="top" />
      <TouchableOpacity style={styles.submit} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <><Send size={17} color="#fff" /><Text style={styles.submitText}>Send message</Text></>}
      </TouchableOpacity>
    </ScrollView>
  </View>;
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ECEEF4' },
  back: { padding: 6, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#18204F' },
  content: { padding: 18, paddingBottom: 32 },
  intro: { fontSize: 14, color: '#676C7F', lineHeight: 20, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: '#3D425B', marginBottom: 7, marginTop: 13 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E5EF', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 12, fontSize: 15, color: '#20243A' },
  message: { minHeight: 120 },
  submit: { marginTop: 24, backgroundColor: '#263077', borderRadius: 10, padding: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  submitText: { fontWeight: '700', fontSize: 15, color: '#fff' },
});

export default ContactSupportScreen;
