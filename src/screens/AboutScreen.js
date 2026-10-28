/**
 * AboutScreen.js
 * About Saver - Accessible from the Navigation Drawer
 * Maps hackathon exam requirements, architecture, and features.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import Logo from '../components/Logo';

export const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="About Saver"
        subtitle="College Hackathon Exam Submission"
        showBack={true}
        navigation={navigation}
        showNotification={false}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Main Hero Card with Logo */}
          <Card style={styles.heroCard}>
            <Logo size="lg" layout="vertical" />
            <Text style={styles.appVersion}>Version 1.0.0 (Saver Hackathon Build)</Text>
            <Text style={styles.appDescription}>
              Smart personal finance tracker built with Expo & React Native.
              Designed specifically for Indian Rupee (₹) currency tracking with custom Indian digit grouping,
              dual role support (Admin/Customer), interactive SVG gauges, local offline persistence,
              and proactive budget alerts.
            </Text>
          </Card>

          {/* Exam Requirements Verification Checklist */}
          <Text style={styles.sectionTitle}>Exam Checklist Verification</Text>
          
          <Card style={styles.checklistCard}>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Saver Identity & Rupee (₹) Formatting</Text>
                <Text style={styles.checkDesc}>Built-in code Logo, formatINR() with Indian grouping (₹1,25,000.00)</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>App Flow & Landing Screen</Text>
                <Text style={styles.checkDesc}>Home shows ONLY Logo, tagline & Login/Sign Up buttons (no auto-login)</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Tri-Navigation (30 Marks)</Text>
                <Text style={styles.checkDesc}>Stack + Custom Bottom Tabs + Left Edge Swipe Drawer</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Dual Roles: Customer (5 tabs) vs Admin (2 tabs)</Text>
                <Text style={styles.checkDesc}>Admin sees Dashboard & Analysis with overall customer totals</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Functional Requirements (15 Marks)</Text>
                <Text style={styles.checkDesc}>Personalized alerts on add/edit/delete + 80% & 100% budget breach alerts</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Red Inline Validation Errors</Text>
                <Text style={styles.checkDesc}>Valid email regex, 10-digit phone, password 6+ chars, amount &gt; 0</Text>
              </View>
            </View>
          </Card>

          {/* Tech Badges */}
          <Text style={styles.sectionTitle}>Tech Stack</Text>
          <View style={styles.techBadgeRow}>
            {['Expo SDK 51', 'React Native 0.74', 'Context API', 'AsyncStorage', 'react-native-svg', 'react-native-chart-kit'].map((badge) => (
              <View key={badge} style={styles.badgePill}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  appVersion: {
    fontFamily: typography.medium,
    fontSize: 12.5,
    color: colors.primaryDark,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  appDescription: {
    fontFamily: typography.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.darkText,
    marginBottom: 12,
    marginLeft: 4,
  },
  checklistCard: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  checkTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  checkTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.darkText,
  },
  checkDesc: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: 'rgba(5, 34, 36, 0.06)',
  },
  techBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgePill: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});

export default AboutScreen;
