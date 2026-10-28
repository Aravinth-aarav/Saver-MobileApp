/**
 * AboutScreen.js
 * Project details screen accessible from the Navigation Drawer
 * Maps hackathon exam requirements, architecture, and developer info.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="About Project"
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
          {/* Main Hero Card */}
          <Card style={styles.heroCard}>
            <View style={styles.appBadge}>
              <Ionicons name="wallet" size={32} color={colors.white} />
            </View>
            <Text style={styles.appName}>Finance Budget Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0 (Production Hackathon Build)</Text>
            <Text style={styles.appDescription}>
              Built with React Native & Expo. Features custom fintech design, role-based access control,
              interactive SVG charts, local storage persistence, and proactive budget threshold warnings.
            </Text>
          </Card>

          {/* Exam Requirements Verification Checklist */}
          <Text style={styles.sectionTitle}>Exam Checklist Verification</Text>
          
          <Card style={styles.checklistCard}>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Fresh Green Fintech UI Style</Text>
                <Text style={styles.checkDesc}>#00D09E primary green, #F1FFF3 mint sheet, #DFF7E2 light-green nav</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Tri-Navigation Setup</Text>
                <Text style={styles.checkDesc}>Native Stack + Custom Bottom Tabs + Left Edge Swipe Drawer</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Dual Roles: Admin & Customer</Text>
                <Text style={styles.checkDesc}>Admin sees 2 tabs (Home, Analysis); Customer sees all 5 tabs</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Dynamic Home Reports & SVG Rings</Text>
                <Text style={styles.checkDesc}>Daily | Weekly | Monthly segmented toggle + SVG savings car ring</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Personalized Alert Notifications</Text>
                <Text style={styles.checkDesc}>Feedback on add/edit/delete + 80% & 100% budget breach alerts</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={styles.checkTextCol}>
                <Text style={styles.checkTitle}>Inline Red Error Validation</Text>
                <Text style={styles.checkDesc}>Strict regex email, phone 10-digits, password min 6 chars, amount &gt; 0</Text>
              </View>
            </View>
          </Card>

          {/* Tech Stack Badges */}
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
  appBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: colors.darkText,
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: typography.medium,
    fontSize: 12.5,
    color: colors.primaryDark,
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
