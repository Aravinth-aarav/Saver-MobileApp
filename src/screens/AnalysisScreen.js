/**
 * AnalysisScreen.js
 * Visual financial analytics for Saver:
 * - Summary KPI cards in Indian Rupees (₹)
 * - Category Donut / Pie Chart
 * - Monthly Income vs Expense Bar Chart in ₹
 * - Category spending breakdown in ₹
 * - Admin mode indicator showing overall totals across all customers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { CategoryProgressBar } from '../components/ProgressBar';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const AnalysisScreen = ({ navigation }) => {
  const { transactions, categories, getMonthlyTotals } = useFinance();
  const { role, currentUser } = useAuth();
  const [selectedChartType, setSelectedChartType] = useState('categories');

  const totals = getMonthlyTotals();
  const savingsRate = totals.totalIncome > 0
    ? Math.max(0, Math.round(((totals.totalIncome - totals.totalExpense) / totals.totalIncome) * 100))
    : 0;

  // Calculate per-category expenses
  const categorySpending = categories.map((cat) => {
    let spent = 0;
    transactions.forEach((tx) => {
      if (
        tx.type === 'expense' &&
        (tx.categoryGroup === cat.name ||
         tx.categoryGroup === cat.displayName ||
         tx.category === cat.name)
      ) {
        spent += Math.abs(Number(tx.amount) || 0);
      }
    });

    const percent = totals.totalExpense > 0
      ? Math.round((spent / totals.totalExpense) * 100)
      : 0;

    return {
      ...cat,
      spent,
      percent,
    };
  }).sort((a, b) => b.spent - a.spent);

  // Pie chart dataset
  const chartColors = ['#00D09E', '#3299FF', '#6DB6FE', '#0068FF', '#FFA800', '#FF4D4D'];
  const pieData = categorySpending
    .filter((c) => c.spent > 0)
    .map((c, index) => ({
      name: c.name,
      population: c.spent,
      color: chartColors[index % chartColors.length],
      legendFontColor: colors.darkText,
      legendFontSize: 12,
    }));

  // Bar chart dataset in ₹
  const barData = {
    labels: ['Income', 'Expense', 'Saved'],
    datasets: [
      {
        data: [
          totals.totalIncome,
          totals.totalExpense,
          Math.max(0, totals.balance),
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header
        title="Financial Analysis"
        subtitle={role === 'admin' ? 'Admin Overview Across All Customers' : 'Your spending insights in ₹'}
        showBack={false}
        navigation={navigation}
        showNotification={true}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Admin Banner */}
          {role === 'admin' && (
            <View style={styles.adminBanner}>
              <Ionicons name="shield-checkmark" size={18} color={colors.white} />
              <Text style={styles.adminBannerText}>
                Admin View Active: Showing overall financial metrics across all customers
              </Text>
            </View>
          )}

          {/* 1. Summary KPI Grid in ₹ */}
          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, shadows.card]}>
              <View style={[styles.kpiIcon, { backgroundColor: '#E2FBE9' }]}>
                <Ionicons name="arrow-down" size={18} color={colors.primary} />
              </View>
              <Text style={styles.kpiLabel}>Total Income</Text>
              <Text style={styles.kpiValueIncome}>
                {formatINR(totals.totalIncome)}
              </Text>
            </View>

            <View style={[styles.kpiCard, shadows.card]}>
              <View style={[styles.kpiIcon, { backgroundColor: '#E8F2FF' }]}>
                <Ionicons name="arrow-up" size={18} color={colors.blueAmount} />
              </View>
              <Text style={styles.kpiLabel}>Total Expense</Text>
              <Text style={styles.kpiValueExpense}>
                {formatINR(-totals.totalExpense)}
              </Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, shadows.card]}>
              <View style={[styles.kpiIcon, { backgroundColor: '#E6F8F3' }]}>
                <Ionicons name="wallet-outline" size={18} color={colors.darkText} />
              </View>
              <Text style={styles.kpiLabel}>Total Balance</Text>
              <Text style={styles.kpiValueBalance}>
                {formatINR(totals.balance)}
              </Text>
            </View>

            <View style={[styles.kpiCard, shadows.card]}>
              <View style={[styles.kpiIcon, { backgroundColor: '#FFF4E0' }]}>
                <Ionicons name="trending-up" size={18} color={colors.warning} />
              </View>
              <Text style={styles.kpiLabel}>Savings Rate</Text>
              <Text style={styles.kpiValueRate}>
                {savingsRate}%
              </Text>
            </View>
          </View>

          {/* Chart Segment Selector */}
          <View style={styles.chartToggleContainer}>
            <TouchableOpacity
              onPress={() => setSelectedChartType('categories')}
              style={[
                styles.chartToggleBtn,
                selectedChartType === 'categories' && styles.chartToggleBtnActive,
              ]}
            >
              <Ionicons
                name="pie-chart-outline"
                size={16}
                color={selectedChartType === 'categories' ? colors.white : colors.darkText}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.chartToggleText,
                  selectedChartType === 'categories' && styles.chartToggleTextActive,
                ]}
              >
                Category Donut
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedChartType('comparison')}
              style={[
                styles.chartToggleBtn,
                selectedChartType === 'comparison' && styles.chartToggleBtnActive,
              ]}
            >
              <Ionicons
                name="bar-chart-outline"
                size={16}
                color={selectedChartType === 'comparison' ? colors.white : colors.darkText}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.chartToggleText,
                  selectedChartType === 'comparison' && styles.chartToggleTextActive,
                ]}
              >
                Income vs Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Charts Container */}
          <Card style={styles.chartCard}>
            {selectedChartType === 'categories' ? (
              <View style={styles.chartWrapper}>
                <Text style={styles.chartTitle}>Expense Distribution by Category</Text>
                {pieData.length > 0 ? (
                  <PieChart
                    data={pieData}
                    width={screenWidth - 72}
                    height={200}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="10"
                    absolute
                  />
                ) : (
                  <View style={styles.emptyChart}>
                    <Text style={styles.emptyChartText}>No expense data to graph yet.</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.chartWrapper}>
                <Text style={styles.chartTitle}>Monthly Income vs Expenses (₹)</Text>
                <BarChart
                  data={barData}
                  width={screenWidth - 72}
                  height={220}
                  yAxisLabel="₹"
                  yAxisSuffix=""
                  fromZero
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 208, 158, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(5, 34, 36, ${opacity})`,
                    barPercentage: 0.65,
                  }}
                  style={{ borderRadius: 16 }}
                />
              </View>
            )}
          </Card>

          {/* Category Spending Breakdown in ₹ */}
          <Text style={styles.sectionHeading}>Category Spending Breakdown</Text>
          {categorySpending.map((cat) => (
            <View key={cat.id} style={styles.breakdownRow}>
              <View style={styles.catLeftInfo}>
                <View style={[styles.catBullet, { backgroundColor: cat.color || colors.primary }]} />
                <Text style={styles.catName}>{cat.displayName || cat.name}</Text>
              </View>

              <View style={styles.catRightInfo}>
                <Text style={styles.catSpent}>{formatINR(cat.spent)}</Text>
                <Text style={styles.catPercent}>({cat.percent}%)</Text>
              </View>

              <View style={styles.miniBarContainer}>
                <CategoryProgressBar percent={cat.percent} height={6} />
              </View>
            </View>
          ))}

          <View style={{ height: 80 }} />
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
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blueAmount,
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 16,
  },
  adminBannerText: {
    fontFamily: typography.semiBold,
    fontSize: 12.5,
    color: colors.white,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  kpiIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  kpiValueIncome: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 16,
    color: colors.primaryDark,
  },
  kpiValueExpense: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 16,
    color: colors.blueAmount,
  },
  kpiValueBalance: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 16,
    color: colors.darkText,
  },
  kpiValueRate: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 16,
    color: colors.warning,
  },
  chartToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.pill,
    padding: 4,
    marginVertical: 14,
  },
  chartToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.pill,
  },
  chartToggleBtnActive: {
    backgroundColor: colors.primary,
  },
  chartToggleText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.darkText,
  },
  chartToggleTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  chartCard: {
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  chartTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.darkText,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  emptyChart: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyChartText: {
    fontFamily: typography.regular,
    color: colors.textMuted,
    fontSize: 14,
  },
  sectionHeading: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.darkText,
    marginBottom: 12,
  },
  breakdownRow: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  catLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  catBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  catName: {
    fontFamily: typography.semiBold,
    fontWeight: '600',
    fontSize: 14,
    color: colors.darkText,
    flex: 1,
  },
  catRightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catSpent: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.blueAmount,
  },
  catPercent: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  miniBarContainer: {
    width: '100%',
  },
});

export default AnalysisScreen;
