/**
 * WelcomeScreen.js
 * Landing screen with fresh green fintech styling, logo,
 * demo credentials hint, and Sign In / Sign Up navigation.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

export const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Logo & Illustration */}
        <View style={styles.heroSection}>
          <View style={[styles.logoCircle, shadows.button]}>
            <Ionicons name="wallet" size={48} color={colors.white} />
          </View>

          <Text style={styles.brandTitle}>Finance Tracker</Text>
          <Text style={styles.tagline}>
            Smart Budgeting, Goal Tracking & Expense Analytics
          </Text>
        </View>

        {/* Feature Highlights Pills */}
        <View style={styles.featureContainer}>
          <View style={styles.featurePill}>
            <View style={[styles.featureIcon, { backgroundColor: '#3299FF' }]}>
              <Ionicons name="pie-chart" size={18} color={colors.white} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Visual Analytics</Text>
              <Text style={styles.featureDesc}>Donut charts & category breakdowns</Text>
            </View>
          </View>

          <View style={styles.featurePill}>
            <View style={[styles.featureIcon, { backgroundColor: '#00D09E' }]}>
              <Ionicons name="notifications" size={18} color={colors.white} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Personalized Alerts</Text>
              <Text style={styles.featureDesc}>Smart 80% & 100% budget alerts</Text>
            </View>
          </View>

          <View style={styles.featurePill}>
            <View style={[styles.featureIcon, { backgroundColor: '#0068FF' }]}>
              <Ionicons name="shield-checkmark" size={18} color={colors.white} />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Admin & Customer Roles</Text>
              <Text style={styles.featureDesc}>Tailored dashboards for both user types</Text>
            </View>
          </View>
        </View>

        {/* Demo Credentials Box */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Ionicons name="key-outline" size={16} color={colors.darkText} />
            <Text style={styles.demoTitle}>Demo Logins for Evaluation</Text>
          </View>
          <Text style={styles.demoText}>
            👤 Customer: <Text style={styles.demoBold}>customer@demo.com</Text> / Customer@123
          </Text>
          <Text style={styles.demoText}>
            👑 Admin: <Text style={styles.demoBold}>admin@demo.com</Text> / Admin@123
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('SignIn')}
            variant="primary"
            size="lg"
            style={styles.btn}
          />

          <Button
            title="Create New Account"
            onPress={() => navigation.navigate('SignUp')}
            variant="secondary"
            size="lg"
            style={[styles.btn, { marginTop: 12 }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Mint background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 28,
    color: colors.darkText,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: typography.regular,
    fontSize: 14.5,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 21,
  },
  featureContainer: {
    width: '100%',
    marginVertical: 20,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: borderRadius.card,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14.5,
    color: colors.darkText,
  },
  featureDesc: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  demoBox: {
    width: '100%',
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.card,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8ECCF',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoTitle: {
    fontFamily: typography.semiBold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.darkText,
    marginLeft: 6,
  },
  demoText: {
    fontFamily: typography.regular,
    fontSize: 12.5,
    color: colors.darkText,
    marginTop: 3,
  },
  demoBold: {
    fontWeight: '700',
    color: colors.blueAmount,
  },
  actionSection: {
    width: '100%',
  },
  btn: {
    width: '100%',
  },
});

export default WelcomeScreen;
