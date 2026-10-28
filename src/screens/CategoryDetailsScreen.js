/**
 * CategoryDetailsScreen.js
 * Detailed category view in Indian Rupees (₹):
 * Total spent, budget left, progress warning (>80% / 100%),
 * consumption gauge chart, and category-filtered transaction list.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { TransactionItem } from '../components/TransactionItem';
import { CategoryProgressBar } from '../components/ProgressBar';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../utils/formatters';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, displayName } = route.params || {};
  const { categories, transactions } = useFinance();

  const currentCategory = categories.find((c) => c.id === categoryId || c.name === categoryName) || {
    id: 'unknown',
    name: categoryName || 'Category',
    displayName: displayName || categoryName || 'Category',
    budget: 5000,
    color: colors.primary,
  };

  const categoryTransactions = transactions.filter(
    (tx) =>
      tx.category === currentCategory.name ||
      tx.categoryGroup === currentCategory.name ||
      tx.categoryGroup === currentCategory.displayName
  );

  let totalSpent = 0;
  categoryTransactions.forEach((tx) => {
    if (tx.type === 'expense') {
      totalSpent += Math.abs(Number(tx.amount) || 0);
    }
  });

  const budget = currentCategory.budget || 5000;
  const budgetLeft = Math.max(0, budget - totalSpent);
  const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const isOverBudget = percentUsed >= 100;
  const isWarning = percentUsed >= 80 && percentUsed < 100;

  const chartData = {
    labels: ['Spent'],
    data: [Math.min(1, totalSpent / budget)],
  };

  return (
    <View style={styles.container}>
      <Header
        title={currentCategory.displayName || currentCategory.name}
        subtitle="Category Budget & Activity in ₹"
        showBack={true}
        navigation={navigation}
        showNotification={false}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Status Warning Banner if >= 80% */}
          {isOverBudget && (
            <View style={styles.alertBannerDanger}>
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
              <Text style={styles.alertBannerTextDanger}>
                Budget Exceeded! You have spent {formatINR(totalSpent)} of your {formatINR(budget)} limit.
              </Text>
            </View>
          )}

          {isWarning && (
            <View style={styles.alertBannerWarning}>
              <Ionicons name="warning" size={20} color={colors.warning} />
              <Text style={styles.alertBannerTextWarning}>
                Budget Warning! You have consumed {percentUsed.toFixed(0)}% of your category limit.
              </Text>
            </View>
          )}

          {/* Stats Card: Total Spent & Budget Left in ₹ */}
          <Card variant="darkBlue" style={styles.statsCard}>
            <View style={styles.statsTopRow}>
              <View>
                <Text style={styles.statLabel}>Total Spent</Text>
                <Text style={styles.statSpentValue}>{formatINR(totalSpent)}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Budget Left</Text>
                <Text style={[styles.statLeftValue, isOverBudget && { color: colors.danger }]}>
                  {formatINR(budgetLeft)}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressMeta}>
                <Text style={styles.progressMetaLabel}>Allocated: {formatINR(budget)}</Text>
                <Text style={styles.progressMetaPercent}>{percentUsed.toFixed(0)}% Used</Text>
              </View>
              <CategoryProgressBar percent={percentUsed} height={10} />
            </View>
          </Card>

          {/* Mini Ring Chart */}
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Consumption Gauge</Text>
            <View style={styles.ringCenter}>
              <ProgressChart
                data={chartData}
                width={screenWidth - 80}
                height={130}
                strokeWidth={14}
                radius={38}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) =>
                    isOverBudget
                      ? `rgba(255, 77, 77, ${opacity})`
                      : isWarning
                      ? `rgba(255, 168, 0, ${opacity})`
                      : `rgba(0, 208, 158, ${opacity})`,
                }}
                hideLegend={false}
              />
            </View>
          </Card>

          {/* Transactions for this Category */}
          <View style={styles.transactionsHeaderRow}>
            <Text style={styles.sectionTitle}>
              {currentCategory.name} Transactions ({categoryTransactions.length})
            </Text>
          </View>

          {categoryTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={40} color={colors.textLight} />
              <Text style={styles.emptyText}>No transactions in this category yet.</Text>
            </View>
          ) : (
            categoryTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => navigation.navigate('TransactionsTab')}
              />
            ))
          )}

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
  alertBannerDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  alertBannerTextDanger: {
    fontFamily: typography.semiBold,
    fontSize: 13,
    color: colors.danger,
    marginLeft: 8,
    flex: 1,
  },
  alertBannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E0',
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  alertBannerTextWarning: {
    fontFamily: typography.semiBold,
    fontSize: 13,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  statsCard: {
    backgroundColor: colors.darkBlueCard || '#0D2B52',
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  statsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statSpentValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: '#FFFFFF',
  },
  statLeftValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 22,
    color: '#34D399',
  },
  statDivider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  progressContainer: {
    marginTop: 6,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressMetaLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
  progressMetaPercent: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 12,
    color: '#38BDF8',
  },
  chartCard: {
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14.5,
    color: colors.darkText,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16.5,
    color: colors.darkText,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: borderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
});

export default CategoryDetailsScreen;
