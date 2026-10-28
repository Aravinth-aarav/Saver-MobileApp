/**
 * SignUpScreen.js
 * Account registration screen with role selector (Customer / Admin),
 * comprehensive inline red error validation, and automatic session login.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';

export const SignUpScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setAuthError('');
    const errs = {};

    const nameErr = validateName(name);
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;

    const passErr = validatePassword(password);
    if (passErr) errs.password = passErr;

    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) errs.confirmPassword = confirmErr;

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await signup({
      name,
      email,
      phone,
      password,
      role,
    });
    setLoading(false);

    if (!result.success) {
      setAuthError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sign Up"
        subtitle="Create your finance tracker profile"
        showBack={true}
        navigation={navigation}
        showNotification={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.mintSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
          >
            {/* Role Selector Pill */}
            <Text style={styles.sectionLabel}>Select Your Account Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRole('customer')}
                style={[
                  styles.rolePill,
                  role === 'customer' && styles.rolePillActive,
                ]}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'customer' ? colors.white : colors.darkText}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'customer' && styles.roleTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRole('admin')}
                style={[
                  styles.rolePill,
                  role === 'admin' && styles.rolePillActive,
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={role === 'admin' ? colors.white : colors.darkText}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'admin' && styles.roleTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Global Error Banner */}
            {authError ? (
              <View style={styles.authErrorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            ) : null}

            {/* Full Name */}
            <InputField
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Priya Sharma"
              icon="person-outline"
              autoCapitalize="words"
              error={errors.name}
            />

            {/* Email Address */}
            <InputField
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="e.g. priya@domain.com"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            {/* Phone Number (10 digits) */}
            <InputField
              label="Phone Number (10 Digits)"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
              }}
              placeholder="e.g. 9876543210"
              icon="call-outline"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            {/* Password */}
            <InputField
              label="Password (min 6 chars, letter + number)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="Create strong password"
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Re-enter your password"
              icon="shield-checkmark-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              variant="primary"
              size="lg"
              style={{ marginTop: 10 }}
            />

            {/* Sign In link */}
            <View style={styles.signinPromptRow}>
              <Text style={styles.promptText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signinLinkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  mintSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.sheet,
    borderTopRightRadius: borderRadius.sheet,
    marginTop: -16,
    overflow: 'hidden',
  },
  sheetScroll: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 14,
    color: colors.darkText,
    marginBottom: 8,
    marginLeft: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.pill,
    padding: 4,
    marginBottom: 16,
  },
  rolePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: borderRadius.pill,
  },
  rolePillActive: {
    backgroundColor: colors.primary,
  },
  roleText: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 14,
    color: colors.darkText,
  },
  roleTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  authErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  authErrorText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.danger,
    marginLeft: 8,
    flex: 1,
  },
  signinPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  promptText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  signinLinkText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.primaryDark,
  },
});

export default SignUpScreen;
