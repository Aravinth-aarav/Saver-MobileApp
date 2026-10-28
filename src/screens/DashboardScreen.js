/**
 * DashboardScreen.js
 * The main financial dashboard for Saver:
 * 1. Top Green Header: menu icon, "Hi, Welcome Back" + greeting & user name, bell circle,
 *    Total Balance & Total Expense in ₹, budget progress bar with dynamic message.
 * 2. Mint rounded bottom sheet:
 *    a. Green Card with SVG circular ring (car icon, "Savings On Goals"),
 *       vertical divider, "Revenue Last Week" (₹42,000.00), "Food Last Week" (-₹1,800.00).
 *    b. Segmented toggle: Daily | Weekly | Monthly (updates report totals & list in real time).
 *    c. Detailed Transaction list in ₹ (blue tile, title, blue time/date, dividers, category, amount).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
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
  const [notificationVisible, setNotificationVisible] = useState(false);

  const monthlyTotals = getMonthlyTotals();
  const reportData = getReportData(selectedTimeframe);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      {/* 1. Green Header with Stats & Progress Bar in ₹ */}
      <Header
        navigation={navigation}
        showFullStats={true}
        balance={monthlyTotals.balance}
        expense={monthlyTotals.totalExpense}
        budgetPercent={monthlyTotals.budgetUsagePercent}
        budgetGoal={savingsGoal.goalAmount || 200000.0}
        showNotification={true}
        onNotificationPress={() => setNotificationVisible(true)}
      />

      {/* 2. Mint Rounded Sheet overlapping header */}
      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Green Card: Savings On Goals & Last Week Stats in ₹ */}
          <View style={[styles.greenCard, shadows.card]}>
            {/* Left: Circular SVG ring with car icon */}
            <View style={styles.cardLeftCol}>
              <CircularProgress
                size={82}
                strokeWidth={7}
                percentage={savingsGoal.percentage || 71}
                iconName="car"
                ringColor="#052224"
                trackColor="rgba(255, 255, 255, 0.45)"
              />
              <Text style={styles.savingsLabel}>Savings On Goals</Text>
            </View>

            {/* Vertical Divider */}
            <View style={styles.cardVerticalDivider} />

            {/* Right: Revenue Last Week & Food Last Week */}
            <View style={styles.cardRightCol}>
              <View style={styles.statSubRow}>
                <View style={styles.statIconBox}>
                  <Ionicons name="cash-outline" size={18} color="#052224" />
                </View>
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubtitle}>Revenue Last Week</Text>
                  <Text style={styles.statRevenueAmount}>
                    {formatINR(savingsGoal.revenueLastWeek, { showExplicitPlus: true })}
                  </Text>
                </View>
              </View>

              <View style={styles.cardHorizontalDivider} />

              <View style={styles.statSubRow}>
                <View style={styles.statIconBox}>
                  <Ionicons name="restaurant-outline" size={18} color="#052224" />
                </View>
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubtitle}>Food Last Week</Text>
                  <Text style={styles.statFoodAmount}>
                    {formatINR(savingsGoal.foodLastWeek)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

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
              <Ionicons name="receipt-outline" size={42} color={colors.textLight} />
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

      {/* Notifications preview modal */}
      <PersonalizedAlertModal
        visible={notificationVisible}
        alertData={{
          title: 'Notifications 🔔',
          message: `Active goal (${savingsGoal.target}: ${savingsGoal.percentage}% saved). Your monthly budget usage is at ${monthlyTotals.budgetUsagePercent}%.`,
          type: monthlyTotals.budgetUsagePercent > 80 ? 'warning' : 'success',
        }}
        onDismiss={() => setNotificationVisible(false)}
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
  greenCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardLeftCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsLabel: {
    fontFamily: typography.semiBold,
    fontWeight: '700',
    fontSize: 12.5,
    color: colors.darkText,
    marginTop: 8,
    textAlign: 'center',
  },
  cardVerticalDivider: {
    width: 1.5,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 12,
  },
  cardRightCol: {
    flex: 1.25,
    justifyContent: 'space-around',
  },
  statSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
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
    color: colors.darkText,
    opacity: 0.85,
  },
  statRevenueAmount: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 15,
    color: colors.darkText,
  },
  statFoodAmount: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 15,
    color: colors.blueAmount,
  },
  cardHorizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginVertical: 8,
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
