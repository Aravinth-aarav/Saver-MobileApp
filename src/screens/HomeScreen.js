/**
 * HomeScreen.js
 * 100% Faithful implementation of the Reference Fintech Layout:
 * 1. Top Green Header with greeting, drawer hamburger, notification bell,
 *    Total Balance & Total Expense, budget progress bar with dynamic message.
 * 2. Mint rounded bottom sheet (~50px top corners):
 *    a. Green Card with SVG circular ring (car icon, "Savings On Goals"),
 *       vertical divider, "Revenue Last Week", horizontal divider, "Food Last Week".
 *    b. Segmented toggle: Daily | Weekly | Monthly (updates totals & list in real time).
 *    c. Detailed Transaction list: blue tile, title, blue time & date, category, amount.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { SegmentedToggle } from '../components/SegmentedToggle';
import { CircularProgress } from '../components/CircularProgress';
import { TransactionItem } from '../components/TransactionItem';
import { PersonalizedAlertModal } from '../components/PersonalizedAlertModal';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const HomeScreen = ({ navigation }) => {
  const {
    getMonthlyTotals,
    getReportData,
    savingsGoal,
    activeAlert,
    dismissAlert,
  } = useFinance();

  const [selectedTimeframe, setSelectedTimeframe] = useState('Weekly');
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Overall monthly totals for header
  const monthlyTotals = getMonthlyTotals();

  // Segmented report data (Daily | Weekly | Monthly)
  const reportData = getReportData(selectedTimeframe);

  const handleNotificationPress = () => {
    setNotificationVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      {/* 1. Top Green Header with stats and progress bar */}
      <Header
        navigation={navigation}
        showFullStats={true}
        balance={monthlyTotals.balance}
        expense={monthlyTotals.totalExpense}
        budgetPercent={monthlyTotals.budgetUsagePercent}
        budgetGoal={savingsGoal.goalAmount || 20000.0}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
      />

      {/* 2. Mint Rounded Bottom Sheet overlapping the header */}
      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* 4a. Green Card: Savings On Goals & Last Week Stats */}
          <View style={[styles.greenCard, shadows.card]}>
            {/* Left side: Circular SVG ring with car icon & label */}
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

            {/* Right side: Revenue Last Week and Food Last Week */}
            <View style={styles.cardRightCol}>
              {/* Revenue Last Week */}
              <View style={styles.statSubRow}>
                <View style={styles.statIconBox}>
                  <Ionicons name="cash-outline" size={18} color="#052224" />
                </View>
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubtitle}>Revenue Last Week</Text>
                  <Text style={styles.statRevenueAmount}>
                    {formatCurrency(savingsGoal.revenueLastWeek, { showExplicitPlus: true })}
                  </Text>
                </View>
              </View>

              {/* Horizontal Divider */}
              <View style={styles.cardHorizontalDivider} />

              {/* Food Last Week */}
              <View style={styles.statSubRow}>
                <View style={styles.statIconBox}>
                  <Ionicons name="restaurant-outline" size={18} color="#052224" />
                </View>
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubtitle}>Food Last Week</Text>
                  <Text style={styles.statFoodAmount}>
                    {formatCurrency(savingsGoal.foodLastWeek)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 4b. Segmented Toggle: Daily | Weekly | Monthly */}
          <SegmentedToggle
            options={['Daily', 'Weekly', 'Monthly']}
            selected={selectedTimeframe}
            onSelect={(option) => setSelectedTimeframe(option)}
          />

          {/* Timeframe Summary Mini-Pill */}
          <View style={styles.timeframeSummaryRow}>
            <Text style={styles.reportSectionTitle}>
              {selectedTimeframe} Transactions
            </Text>
            <View style={styles.reportBadge}>
              <Text style={styles.reportBadgeText}>
                Net: {formatCurrency(reportData.balance, { showExplicitPlus: true })}
              </Text>
            </View>
          </View>

          {/* 4c. Detailed Transaction List */}
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
                    navigation.navigate('Transactions');
                  }
                }}
              />
            ))
          )}

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      {/* Global Personalized Alert Modal (Triggered on add/edit/delete or budget threshold) */}
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
          message: `You have 1 active savings goal (${savingsGoal.target}: ${savingsGoal.percentage}% achieved) and your budget usage is currently at ${monthlyTotals.budgetUsagePercent}%.`,
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
    backgroundColor: colors.primary, // Green top
  },
  mintSheet: {
    flex: 1,
    backgroundColor: colors.background, // Mint background #F1FFF3
    borderTopLeftRadius: borderRadius.sheet, // ~50px top corners
    borderTopRightRadius: borderRadius.sheet,
    marginTop: -26,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  // 4a. Green Card
  greenCard: {
    backgroundColor: colors.primary, // Green Card #00D09E
    borderRadius: borderRadius.card, // ~25px rounded corners
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
    color: colors.blueAmount, // Blue negative amount
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

export default HomeScreen;
