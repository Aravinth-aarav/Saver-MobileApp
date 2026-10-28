/**
 * HomeScreen.js (Landing Screen)
 * The initial landing screen when scanning Expo QR code (No auto-login):
 * Shows ONLY:
 * 1. The Saver logo (rupee symbol ₹ inside rounded green badge) + app name "Saver"
 * 2. Tagline: "Save smart. Spend wise."
 * 3. Two buttons: "Login" and "Sign Up"
 * No forms and no other content per exam specification!
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import Logo from '../components/Logo';
import Button from '../components/Button';

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* Center: Brand Identity */}
        <View style={styles.centerBrandSection}>
          <Logo size="xl" layout="vertical" />

          <Text style={styles.tagline}>
            Save smart. Spend wise.
          </Text>
        </View>

        {/* Bottom: Two Buttons only */}
        <View style={styles.buttonSection}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            size="lg"
            style={styles.btn}
          />

          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            variant="secondary"
            size="lg"
            style={[styles.btn, { marginTop: 14 }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Mint background #F1FFF3
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerBrandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontFamily: typography.medium,
    fontWeight: '500',
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: 0.2,
  },
  buttonSection: {
    width: '100%',
    paddingBottom: 24,
  },
  btn: {
    width: '100%',
  },
});

export default HomeScreen;
