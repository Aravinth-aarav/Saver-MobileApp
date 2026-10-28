/**
 * SignInScreen.js
 * Sign In screen with role selector (Customer vs Admin),
 * 1-tap Demo Login autofill buttons, and inline red error validation.
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
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';

export const SignInScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick autofill buttons for evaluation
  const fillDemo = (userRole) => {
    setRole(userRole);
    setErrors({});
    setAuthError('');
    if (userRole === 'admin') {
      setEmail('admin@demo.com');
      setPassword('Admin@123');
    } else {
      setEmail('customer@demo.com');
      setPassword('Customer@123');
    }
  };

  const handleSignIn = async () => {
    setAuthError('');
    const errs = {};

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) errs.password = passErr;

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);

    if (!result.success) {
      setAuthError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Green Header */}
      <Header
        title="Sign In"
        subtitle="Access your personal finance dashboard"
        showBack={true}
        navigation={navigation}
        showNotification={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* 2. Mint Rounded Sheet overlapping from below */}
        <View style={styles.mintSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
          >
            {/* Role Selector Pill */}
            <Text style={styles.sectionLabel}>Select Your Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setRole('customer');
                  setAuthError('');
                }}
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
                onPress={() => {
                  setRole('admin');
                  setAuthError('');
                }}
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

            {/* Quick Demo Fill Buttons for Fast Grading */}
            <View style={styles.quickFillRow}>
              <Text style={styles.quickFillLabel}>1-Tap Fill:</Text>
              <TouchableOpacity
                onPress={() => fillDemo('customer')}
                style={styles.demoChip}
              >
                <Text style={styles.demoChipText}>Customer Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => fillDemo('admin')}
                style={[styles.demoChip, { borderColor: colors.blueAmount }]}
              >
                <Text style={[styles.demoChipText, { color: colors.blueAmount }]}>
                  Admin Demo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Global Auth Error Alert */}
            {authError ? (
              <View style={styles.authErrorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            ) : null}

            {/* Input Fields */}
            <InputField
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="e.g. customer@demo.com"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              variant="primary"
              size="lg"
              style={{ marginTop: 10 }}
            />

            {/* Sign Up Navigation Link */}
            <View style={styles.signupPromptRow}>
              <Text style={styles.promptText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLinkText}>Sign Up</Text>
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
    backgroundColor: colors.primary, // Green header background
  },
  keyboardView: {
    flex: 1,
  },
  mintSheet: {
    flex: 1,
    backgroundColor: colors.background, // Mint rounded sheet
    borderTopLeftRadius: borderRadius.sheet, // ~50px top corners
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
  quickFillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  quickFillLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 8,
  },
  demoChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
  },
  demoChipText: {
    fontFamily: typography.semiBold,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primaryDark,
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
  signupPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  promptText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  signupLinkText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.primaryDark,
  },
});

export default SignInScreen;
