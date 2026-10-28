/**
 * EditProfileScreen.js
 * Form allowing customer to update Name, Email, 10-digit Phone,
 * and Monthly Budget Goal in Rupees (₹) with red inline error validation.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, borderRadius } from '../constants/theme';
import { Header } from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAmount,
} from '../utils/validators';

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile } = useAuth();
  const { monthlyBudget, updateMonthlyBudget } = useFinance();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [budget, setBudget] = useState(String(monthlyBudget || 35000));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const errs = {};

    const nameErr = validateName(name);
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;

    const budgetErr = validateAmount(budget);
    if (budgetErr) errs.budget = budgetErr;

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      monthlyBudget: Number(budget),
    });

    await updateMonthlyBudget(Number(budget));

    setLoading(false);
    Alert.alert('Success', 'Profile & budget updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        subtitle="Update contact info & budget in ₹"
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
            contentContainerStyle={styles.sheetContent}
          >
            <InputField
              label="Full Name *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Priya Sharma"
              icon="person-outline"
              error={errors.name}
            />

            <InputField
              label="Email Address *"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="e.g. priya@demo.com"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Phone Number (10 Digits) *"
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

            <InputField
              label="Monthly Budget Limit (₹) *"
              value={budget}
              onChangeText={(text) => {
                setBudget(text);
                if (errors.budget) setErrors((prev) => ({ ...prev, budget: null }));
              }}
              placeholder="e.g. 35000"
              icon="cash-outline"
              keyboardType="decimal-pad"
              error={errors.budget}
            />

            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              variant="primary"
              size="lg"
              style={{ marginTop: 14 }}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="md"
              style={{ marginTop: 8 }}
            />
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
    marginTop: -20,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
  },
});

export default EditProfileScreen;
