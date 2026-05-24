import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from '../hooks/useForm';
import useBookStore from '../store/useBookStore';

const DUMMY_USER = { email: 'admin@library.com', password: '123456', name: 'Admin' };

export default function LoginScreen() {
  const { values, errors, setErrors, handleChange } = useForm({ email: '', password: '' });
  const login = useBookStore((s) => s.login);

  const validate = () => {
    const newErrors = {};
    if (!values.email) newErrors.email = 'Email is required';
    else if (!values.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!values.password) newErrors.password = 'Password is required';
    else if (values.password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    if (values.email === DUMMY_USER.email && values.password === DUMMY_USER.password) {
      await login('dummy-token-123', { name: DUMMY_USER.name, email: DUMMY_USER.email });
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Ionicons name="library" size={64} color="#2c7be5" />
      </View>
      <Text style={styles.title}>Library Manager</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.form}>
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputRow, errors.email && styles.inputError]}>
          <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="admin@library.com"
            value={values.email}
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={13} color="#e74c3c" />
            <Text style={styles.errorText}> {errors.email}</Text>
          </View>
        )}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputRow, errors.password && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••"
            value={values.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry
          />
        </View>
        {errors.password && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={13} color="#e74c3c" />
            <Text style={styles.errorText}> {errors.password}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Sign In</Text>
        </TouchableOpacity>

        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={14} color="#999" />
          <Text style={styles.hint}> admin@library.com / 123456</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  logoContainer: { alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#1a1a2e' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 32 },
  form: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 4 },
  inputIcon: { paddingLeft: 12 },
  input: { flex: 1, padding: 12, fontSize: 15 },
  inputError: { borderColor: '#e74c3c' },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  errorText: { color: '#e74c3c', fontSize: 12 },
  button: { flexDirection: 'row', backgroundColor: '#2c7be5', borderRadius: 8, padding: 14, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hintRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  hint: { textAlign: 'center', color: '#999', fontSize: 12 },
});