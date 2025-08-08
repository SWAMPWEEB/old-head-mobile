import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

/**
 * Screen used for unauthenticated users to request a magic link.  The
 * application only uses passwordless email login, so upon providing a
 * valid email address the user will receive a link to complete the login
 * process.  Once the user clicks the link the Supabase auth listener
 * updates the session in the AuthContext.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      Alert.alert('Error signing in', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a magic link to log in.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Old Head Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <Button
        title={loading ? 'Sending...' : 'Send Magic Link'}
        onPress={handleLogin}
        disabled={loading || !email}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12
  }
});