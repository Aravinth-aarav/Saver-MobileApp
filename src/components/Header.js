/**
 * Header.js
 * Signature Green Top Header with dynamic time-of-day greeting, drawer hamburger,
 * notification bell in light circle, balance & expense stats, and budget progress bar.
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
import { getTimeOfDayGreeting, formatCurrency } from '../utils/formatters';
import { BudgetProgressBar } from './ProgressBar';

export const Header = ({
  navigation,
  showFullStats = false,
  title,
  subtitle,
  balance = 0,
  expense = 0,
  budgetPercent = 30,
  budgetGoal = 20000.0,
  showBack = false,
  showNotification = true,
  onNotificationPress,
}) => {
  const dynamicGreeting = getTimeOfDayGreeting();

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
                <Ionicons name="menu-outline" size={24} color={colors.darkText} />
              </TouchableOpacity>
            )}

            <View style={styles.titleColumn}>
              {showFullStats ? (
                <>
                  <Text style={styles.welcomeBackText}>Hi, Welcome Back</Text>
                  <Text style={styles.greetingText}>{dynamicGreeting}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.screenTitle}>{title || 'Finance Tracker'}</Text>
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
              <Ionicons name="notifications-outline" size={20} color={colors.darkText} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Full Stats (Home screen layout) */}
        {showFullStats && (
          <View style={styles.statsSection}>
            {/* Stats Row: Total Balance and Total Expense with vertical divider */}
            <View style={styles.statsRow}>
              {/* Total Balance */}
              <View style={styles.statBox}>
                <Text style={styles.statLabelWhite}>Total Balance</Text>
                <Text style={styles.balanceAmountWhite}>
                  {formatCurrency(balance)}
                </Text>
              </View>

              {/* Vertical Divider */}
              <View style={styles.verticalDivider} />

              {/* Total Expense */}
              <View style={[styles.statBox, styles.statBoxRight]}>
                <Text style={styles.statLabelWhite}>Total Expense</Text>
                <Text style={styles.expenseAmountBlue}>
                  {formatCurrency(-Math.abs(expense))}
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
    backgroundColor: colors.primary, // #00D09E
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  fullHeader: {
    paddingBottom: 40, // allows mint sheet to overlap
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
    color: colors.darkText, // Bold, dark text
    letterSpacing: -0.3,
  },
  greetingText: {
    fontFamily: typography.medium,
    fontSize: 12.5,
    color: 'rgba(5, 34, 36, 0.8)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Light circle
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
    color: colors.white, // White, bold
  },
  expenseAmountBlue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: colors.blueAmount, // Blue, negative number
  },
  verticalDivider: {
    width: 1.5,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 16,
  },
});

export default Header;
