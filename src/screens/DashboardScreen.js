/**
 * DashboardScreen.js
 * The main financial dashboard for Saver:
 * 1. Top Header: menu icon, greeting & user name, notification bell,
 *    Total Balance & Total Expense in ₹, budget progress bar.
 * 2. Mint rounded bottom sheet:
 *    a. Dark Blue Card (Elevated Navy style): SVG circular progress (car-sport icon, "Savings On Goals"),
 *       vertical divider, "Revenue Last Week" (₹42,000.00), "Food Last Week" (-₹1,800.00).
 *    b. Segmented toggle: Daily | Weekly | Monthly (updates report totals & list in real time).
 *    c. Detailed Transaction list in ₹ with modern styled icons and press feedback.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { SegmentedToggle } from '../components/SegmentedToggle';
import { CircularProgress } from '../components/CircularProgress';
import { TransactionItem } from '../components/TransactionItem';
import { PersonalizedAlertModal } from '../components/PersonalizedAlertModal';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../utils/formatters';

export const DashboardScreen = ({ navigation }) => {
  const {
    getMonthlyTotals,
    getReportData,
    savingsGoal,
    activeAlert,
    dismissAlert,
  } = useFinance();

  const [selectedTimeframe, setSelectedTimeframe] = useState('Weekly');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scaleCardAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCardPressIn = () => {
    Animated.spring(scaleCardAnim, {
      toValue: 0.97,
      speed: 20,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = () => {
    Animated.spring(scaleCardAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const monthlyTotals = getMonthlyTotals();
  const reportData = getReportData(selectedTimeframe);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      {/* 1. Header with Stats & Progress Bar in ₹ */}
      <Header
        navigation={navigation}
        showFullStats={true}
        balance={monthlyTotals.balance}
        expense={monthlyTotals.totalExpense}
        budgetPercent={monthlyTotals.budgetUsagePercent}
        budgetGoal={savingsGoal.goalAmount || 200000.0}
        showNotification={true}
      />

      {/* 2. Mint Rounded Sheet overlapping header */}
      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Animated Dark Blue Card: Savings On Goals & Last Week Stats in ₹ */}
          <Animated.View
            style={[
              styles.darkBlueCard,
              shadows.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleCardAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              onPressIn={handleCardPressIn}
              onPressOut={handleCardPressOut}
              style={styles.cardInnerTouchable}
            >
              {/* Left: Circular SVG ring with modern sports car icon */}
              <View style={styles.cardLeftCol}>
                <CircularProgress
                  size={84}
                  strokeWidth={7.5}
                  percentage={savingsGoal.percentage || 71}
                  iconName="car-sport"
                  iconColor="#FFFFFF"
                  ringColor={colors.primary}
                  trackColor="rgba(255, 255, 255, 0.16)"
                />
                <Text style={styles.savingsLabel}>Savings On Goals</Text>
                <Text style={styles.savingsSubBadge}>
                  {savingsGoal.percentage || 71}% Achieved
                </Text>
              </View>

              {/* Vertical Divider */}
              <View style={styles.cardVerticalDivider} />

              {/* Right: Revenue Last Week & Food Last Week */}
              <View style={styles.cardRightCol}>
                {/* Revenue Row */}
                <View style={styles.statSubRow}>
                  <View style={[styles.statIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                    <Ionicons name="trending-up" size={18} color="#34D399" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statSubtitle}>Revenue Last Week</Text>
                    <Text style={styles.statRevenueAmount}>
                      {formatINR(savingsGoal.revenueLastWeek, { showExplicitPlus: true })}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardHorizontalDivider} />

                {/* Food Row */}
                <View style={styles.statSubRow}>
                  <View style={[styles.statIconBox, { backgroundColor: 'rgba(248, 113, 113, 0.15)' }]}>
                    <Ionicons name="fast-food" size={18} color="#F87171" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statSubtitle}>Food Last Week</Text>
                    <Text style={styles.statFoodAmount}>
                      {formatINR(savingsGoal.foodLastWeek)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Segmented Toggle: Daily | Weekly | Monthly */}
          <SegmentedToggle
            options={['Daily', 'Weekly', 'Monthly']}
            selected={selectedTimeframe}
            onSelect={(option) => setSelectedTimeframe(option)}
          />

          {/* Net Summary Mini-Pill */}
          <View style={styles.timeframeSummaryRow}>
            <Text style={styles.reportSectionTitle}>
              {selectedTimeframe} Transactions
            </Text>
            <View style={styles.reportBadge}>
              <Text style={styles.reportBadgeText}>
                Net: {formatINR(reportData.balance, { showExplicitPlus: true })}
              </Text>
            </View>
          </View>

          {/* Detailed Transaction List in ₹ */}
          {reportData.transactions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="receipt" size={42} color={colors.textLight} />
              <Text style={styles.emptyStateTitle}>No Transactions Recorded</Text>
              <Text style={styles.emptyStateSub}>
                There are no transactions recorded for {selectedTimeframe.toLowerCase()} view.
              </Text>
            </View>
          ) : (
            reportData.transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => {
                  if (navigation && navigation.navigate) {
                    navigation.navigate('TransactionsTab');
                  }
                }}
              />
            ))
          )}

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      {/* Global Personalized Alert Modal */}
      <PersonalizedAlertModal
        visible={!!activeAlert}
        alertData={activeAlert}
        onDismiss={dismissAlert}
      />
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
    marginTop: -26,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  darkBlueCard: {
    backgroundColor: colors.darkBlueCard || '#0D2B52',
    borderRadius: borderRadius.card,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
  },
  cardInnerTouchable: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  cardLeftCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsLabel: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  savingsSubBadge: {
    fontFamily: typography.medium,
    fontSize: 10.5,
    color: '#34D399',
    marginTop: 2,
    fontWeight: '600',
  },
  cardVerticalDivider: {
    width: 1,
    height: 94,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    marginHorizontal: 12,
  },
  cardRightCol: {
    flex: 1.25,
    justifyContent: 'space-around',
  },
  statSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statTextCol: {
    flex: 1,
  },
  statSubtitle: {
    fontFamily: typography.medium,
    fontWeight: '500',
    fontSize: 11,
    color: '#94A3B8',
  },
  statRevenueAmount: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 15.5,
    color: '#34D399',
  },
  statFoodAmount: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 15.5,
    color: '#F87171',
  },
  cardHorizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 7,
    width: '100%',
  },
  timeframeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  reportSectionTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.darkText,
  },
  reportBadge: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  reportBadgeText: {
    fontFamily: typography.semiBold,
    fontWeight: '600',
    fontSize: 12,
    color: colors.primaryDark,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 30,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  emptyStateTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
    marginTop: 12,
  },
  emptyStateSub: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DashboardScreen;
