/**
 * Header.js
 * Signature Green Top Header for Saver:
 * - Hamburger menu icon (opens Drawer)
 * - "Hi, Welcome Back" (bold dark) + dynamic greeting by time of day + user's name
 * - Notification bell in light circle
 * - Total Balance & Total Expense stats in Indian Rupees (₹) with vertical divider
 * - Dynamic Budget Progress Bar with dark % and white remaining goal (₹2,00,000.00)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { colors, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getTimeOfDayGreeting, formatINR } from '../utils/formatters';
import { BudgetProgressBar } from './ProgressBar';
import { useAuth } from '../context/AuthContext';

export const Header = ({
  navigation,
  showFullStats = false,
  title,
  subtitle,
  balance = 0,
  expense = 0,
  budgetPercent = 30,
  budgetGoal = 200000.0,
  showBack = false,
  showNotification = true,
  onNotificationPress,
}) => {
  const dynamicGreeting = getTimeOfDayGreeting();
  const { currentUser } = useAuth();
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Priya';

  const handleMenuPress = () => {
    if (navigation && navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.headerContainer, showFullStats ? styles.fullHeader : styles.compactHeader]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topRow}>
          {/* Left: Menu/Drawer or Back Button + Greeting/Title */}
          <View style={styles.leftGroup}>
            {showBack ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBackPress}
                style={styles.circleIconButton}
              >
                <Ionicons name="arrow-back" size={22} color={colors.darkText} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleMenuPress}
                style={styles.circleIconButton}
              >
                <Ionicons name="menu" size={24} color={colors.darkText} />
              </TouchableOpacity>
            )}

            <View style={styles.titleColumn}>
              {showFullStats ? (
                <>
                  <Text style={styles.welcomeBackText}>Hi, Welcome Back</Text>
                  <Text style={styles.greetingText}>
                    {dynamicGreeting}, {userName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.screenTitle}>{title || 'Saver'}</Text>
                  {subtitle ? <Text style={styles.greetingText}>{subtitle}</Text> : null}
                </>
              )}
            </View>
          </View>

          {/* Right: Notification bell inside light circle */}
          {showNotification && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNotificationPress}
              style={styles.bellCircle}
            >
              <Ionicons name="notifications" size={20} color={colors.darkText} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Full Stats (Dashboard layout) */}
        {showFullStats && (
          <View style={styles.statsSection}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabelWhite}>Total Balance</Text>
                <Text style={styles.balanceAmountWhite}>
                  {formatINR(balance)}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={[styles.statBox, styles.statBoxRight]}>
                <Text style={styles.statLabelWhite}>Total Expense</Text>
                <Text style={styles.expenseAmountBlue}>
                  {formatINR(-Math.abs(expense))}
                </Text>
              </View>
            </View>

            {/* 3. Budget Progress Bar with dark % and white remaining goal */}
            <BudgetProgressBar percent={budgetPercent} goalAmount={budgetGoal} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  fullHeader: {
    paddingBottom: 40,
  },
  compactHeader: {
    paddingBottom: 36,
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleIconButton: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleColumn: {
    flex: 1,
  },
  welcomeBackText: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkText,
    letterSpacing: -0.3,
  },
  greetingText: {
    fontFamily: typography.medium,
    fontSize: 12.5,
    color: 'rgba(5, 34, 36, 0.85)',
    marginTop: 1,
  },
  screenTitle: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkText,
  },
  bellCircle: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blueAmount,
  },
  statsSection: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statBox: {
    flex: 1,
  },
  statBoxRight: {
    alignItems: 'flex-end',
  },
  statLabelWhite: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 12.5,
    color: colors.white,
    marginBottom: 4,
    opacity: 0.9,
  },
  balanceAmountWhite: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: colors.white,
  },
  expenseAmountBlue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: colors.blueAmount,
  },
  verticalDivider: {
    width: 1.5,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 16,
  },
});

export default Header;
