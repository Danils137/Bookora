// Welcome to your Rork app
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const handleLogin = async () => {
    try {
      setError('');
      const result = await loginMutation.mutateAsync({ email, password });
      await login(result.user as any);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      const result = await registerMutation.mutateAsync({
        email,
        password,
        name,
        role,
        companyName: role === 'seller' ? companyName : undefined,
      });
      await login(result.user as any);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Bookora</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <View style={styles.roleContainer}>
                <Text style={styles.label}>I am a:</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[styles.roleButton, role === 'buyer' && styles.roleButtonActive]}
                    onPress={() => setRole('buyer')}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === 'buyer' && styles.roleButtonTextActive,
                      ]}
                    >
                      Buyer
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleButton, role === 'seller' && styles.roleButtonActive]}
                    onPress={() => setRole('seller')}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === 'seller' && styles.roleButtonTextActive,
                      ]}
                    >
                      Seller
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {role === 'seller' && (
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Accounts:</Text>
              <Text style={styles.demoText}>Buyer: buyer@email.com / buyer123</Text>
              <Text style={styles.demoText}>Seller: seller@books.com / seller123</Text>
              <Text style={styles.demoText}>Admin: admin@bookora.com / admin123</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  primaryButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  switchButton: {
    padding: 12,
  },
  switchText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});
