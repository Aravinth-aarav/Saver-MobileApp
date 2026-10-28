/**
 * CategoryDetailsScreen.js
 * Detailed category view in Indian Rupees (₹):
 * Total spent, budget left, progress warning (>80% / 100%),
 * consumption gauge chart, category-filtered transaction list,
 * and quick modal to adjust the category budget.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
import Button from '../components/Button';

const screenWidth = Dimensions.get('window').width;

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, displayName } = route.params || {};
  const { categories, transactions, updateCategoryBudget } = useFinance();

  // Edit Budget Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetError, setBudgetError] = useState('');

  const currentCategory = categories.find((c) => c.id === categoryId || c.name === categoryName) || {
    id: categoryId || 'unknown',
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

  const handleSaveBudget = async () => {
    const val = Number(budgetInput.trim());
    if (isNaN(val) || val <= 0) {
      setBudgetError('Please enter a valid positive budget amount');
      return;
    }
    await updateCategoryBudget(currentCategory.id, val);
    setEditModalVisible(false);
  };

  const adjustBudgetBy = (delta) => {
    const current = Number(budgetInput) || 0;
    const nextVal = Math.max(500, current + delta);
    setBudgetInput(String(nextVal));
    setBudgetError('');
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

            {/* Quick Edit Budget Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setBudgetInput(String(budget));
                setBudgetError('');
                setEditModalVisible(true);
              }}
              style={styles.adjustBudgetBtn}
            >
              <Ionicons name="pencil" size={14} color="#38BDF8" />
              <Text style={styles.adjustBudgetText}>Adjust Category Budget</Text>
            </TouchableOpacity>
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

      {/* Adjust Category Budget Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setEditModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalDragHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <View style={styles.modalIconTile}>
                  <Ionicons name="options" size={20} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Adjust Budget Limit</Text>
                  <Text style={styles.modalSubtitle}>
                    {currentCategory.displayName || currentCategory.name}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={colors.darkText} />
              </TouchableOpacity>
            </View>

            <View style={styles.spentInfoBox}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={styles.spentInfoText}>
                Current Total Spent: {formatINR(totalSpent)}
              </Text>
            </View>

            <Text style={styles.inputLabel}>New Monthly Limit (₹)</Text>
            <View style={[styles.inputContainer, budgetError ? styles.inputErrorBorder : null]}>
              <Text style={styles.rupeePrefix}>₹</Text>
              <TextInput
                style={styles.budgetInput}
                value={budgetInput}
                onChangeText={(text) => {
                  setBudgetInput(text.replace(/[^0-9]/g, ''));
                  if (budgetError) setBudgetError('');
                }}
                keyboardType="numeric"
                placeholder="e.g. 8000"
                placeholderTextColor={colors.textLight}
                maxLength={8}
                autoFocus={true}
              />
            </View>

            {budgetError ? <Text style={styles.errorText}>{budgetError}</Text> : null}

            {/* Quick Adjustment Chips */}
            <Text style={styles.quickChipsLabel}>Quick Adjust</Text>
            <View style={styles.quickChipsRow}>
              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => adjustBudgetBy(500)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹500</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => adjustBudgetBy(1000)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹1,000</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => adjustBudgetBy(2000)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹2,000</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => adjustBudgetBy(5000)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>+₹5,000</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActionsRow}>
              <Button
                title="Save Limit"
                onPress={handleSaveBudget}
                variant="primary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  adjustBudgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 9,
    borderRadius: borderRadius.pill,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  adjustBudgetText: {
    fontFamily: typography.semiBold,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#38BDF8',
    marginLeft: 6,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 34, 36, 0.55)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalDragHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: 'rgba(5, 34, 36, 0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(5, 34, 36, 0.06)',
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIconTile: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 17,
    color: colors.darkText,
  },
  modalSubtitle: {
    fontFamily: typography.medium,
    fontSize: 12.5,
    color: colors.textMuted,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 34, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spentInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2FBE9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginBottom: 16,
  },
  spentInfoText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.darkText,
    marginLeft: 8,
    fontWeight: '600',
  },
  inputLabel: {
    fontFamily: typography.semiBold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(5, 34, 36, 0.1)',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 6,
  },
  inputErrorBorder: {
    borderColor: colors.danger,
  },
  rupeePrefix: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkText,
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.darkText,
  },
  errorText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.danger,
    marginBottom: 10,
    marginLeft: 4,
  },
  quickChipsLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 8,
  },
  quickChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chipBtn: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 158, 0.25)',
  },
  chipText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 12,
    color: colors.primary,
  },
  modalActionsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
});

export default CategoryDetailsScreen;
