/**
 * TransactionsScreen.js
 * Month-wise transactions management in Indian Rupees (₹):
 * - Month selector (prev/next)
 * - Monthly total banner in ₹
 * - Date-grouped transaction list
 * - Add / Edit / Delete modal with inline red error validation
 * - Personalized alert feedback on every mutation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { TransactionItem } from '../components/TransactionItem';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../utils/formatters';
import { validateAmount, validateRequired } from '../utils/validators';

export const TransactionsScreen = ({ navigation }) => {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  // Month navigation: 0 = current month, -1 = last month, etc.
  const [monthOffset, setMonthOffset] = useState(0);
  const [filterType, setFilterType] = useState('all');

  // Modal State for Add / Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formCategory, setFormCategory] = useState('Food');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const currentDate = new Date();
  const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const displayMonthString = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();

  const monthFilteredTx = transactions.filter((tx) => {
    const d = new Date(tx.date);
    const matchesMonth = d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    if (!matchesMonth) return false;
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  let monthlyIncome = 0;
  let monthlyExpense = 0;
  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
      if (tx.type === 'income') {
        monthlyIncome += Math.abs(Number(tx.amount) || 0);
      } else {
        monthlyExpense += Math.abs(Number(tx.amount) || 0);
      }
    }
  });
  const monthlyNet = monthlyIncome - monthlyExpense;

  const groupedTransactions = {};
  monthFilteredTx.forEach((tx) => {
    const txDate = new Date(tx.date);
    const dateKey = txDate.toDateString();
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(tx);
  });

  const openAddModal = () => {
    setEditingTx(null);
    setFormTitle('');
    setFormAmount('');
    setFormType('expense');
    setFormCategory('Food');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setFormTitle(tx.title);
    setFormAmount(String(Math.abs(tx.amount)));
    setFormType(tx.type);
    setFormCategory(tx.category || tx.categoryGroup || 'Food');
    setFormDate(tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormNotes(tx.notes || '');
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSaveTransaction = async () => {
    const errs = {};

    const titleErr = validateRequired(formTitle, 'Transaction title');
    if (titleErr) errs.title = titleErr;

    const amountErr = validateAmount(formAmount);
    if (amountErr) errs.amount = amountErr;

    const dateErr = validateRequired(formDate, 'Date');
    if (dateErr) errs.date = dateErr;

    const catErr = validateRequired(formCategory, 'Category');
    if (catErr) errs.category = catErr;

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingTx) {
      await updateTransaction({
        ...editingTx,
        title: formTitle,
        amount: Number(formAmount),
        type: formType,
        category: formCategory,
        categoryGroup: formCategory,
        date: new Date(formDate).toISOString(),
        notes: formNotes,
      });
    } else {
      await addTransaction({
        title: formTitle,
        amount: Number(formAmount),
        type: formType,
        category: formCategory,
        categoryGroup: formCategory,
        date: new Date(formDate).toISOString(),
        notes: formNotes,
      });
    }

    setModalVisible(false);
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setModalVisible(false);
            await deleteTransaction(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Transactions"
        subtitle="Manage activity in Indian Rupees (₹)"
        showBack={false}
        navigation={navigation}
        showNotification={true}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Month Navigator Header */}
          <View style={styles.monthSelectorRow}>
            <TouchableOpacity
              onPress={() => setMonthOffset((prev) => prev - 1)}
              style={styles.arrowCircle}
            >
              <Ionicons name="chevron-back" size={20} color={colors.darkText} />
            </TouchableOpacity>

            <View style={styles.monthDisplayContainer}>
              <Ionicons name="calendar-outline" size={18} color={colors.primaryDark} style={{ marginRight: 6 }} />
              <Text style={styles.monthDisplayText}>{displayMonthString}</Text>
            </View>

            <TouchableOpacity
              onPress={() => setMonthOffset((prev) => prev + 1)}
              style={styles.arrowCircle}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.darkText} />
            </TouchableOpacity>
          </View>

          {/* Monthly Totals Summary Banner in ₹ */}
          <View style={[styles.summaryCard, shadows.card]}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Monthly Income</Text>
              <Text style={styles.incomeValue}>{formatINR(monthlyIncome)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Monthly Expenses</Text>
              <Text style={styles.expenseValue}>{formatINR(-monthlyExpense)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Net Remaining</Text>
              <Text style={styles.netValue}>{formatINR(monthlyNet)}</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              onPress={() => setFilterType('all')}
              style={[styles.filterPill, filterType === 'all' && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('expense')}
              style={[styles.filterPill, filterType === 'expense' && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, filterType === 'expense' && styles.filterTextActive]}>
                Expenses
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('income')}
              style={[styles.filterPill, filterType === 'income' && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, filterType === 'income' && styles.filterTextActive]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grouped Transaction List */}
          {Object.keys(groupedTransactions).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No Transactions for {displayMonthString}</Text>
              <Text style={styles.emptySubtitle}>
                Tap "+ Add Transaction" below to log expenses or income in ₹.
              </Text>
            </View>
          ) : (
            Object.keys(groupedTransactions).map((dateKey) => (
              <View key={dateKey} style={styles.groupSection}>
                <View style={styles.dateHeaderRow}>
                  <Text style={styles.dateGroupTitle}>{dateKey}</Text>
                  <Text style={styles.itemCountText}>
                    {groupedTransactions[dateKey].length} {groupedTransactions[dateKey].length === 1 ? 'item' : 'items'}
                  </Text>
                </View>

                {groupedTransactions[dateKey].map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={() => openEditModal(tx)}
                  />
                ))}
              </View>
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openAddModal}
          style={[styles.floatingAddBtn, shadows.button]}
        >
          <Ionicons name="add" size={26} color={colors.white} />
          <Text style={styles.floatingAddText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Add / Edit Transaction Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, shadows.sheet]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {editingTx ? 'Edit Transaction' : 'New Transaction'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color={colors.darkText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              {/* Type Switcher */}
              <View style={styles.typeSwitcherRow}>
                <TouchableOpacity
                  onPress={() => setFormType('expense')}
                  style={[
                    styles.typeBtn,
                    formType === 'expense' && styles.typeBtnExpenseActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      formType === 'expense' && styles.typeBtnTextActive,
                    ]}
                  >
                    Expense (-)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFormType('income')}
                  style={[
                    styles.typeBtn,
                    formType === 'income' && styles.typeBtnIncomeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      formType === 'income' && styles.typeBtnTextActive,
                    ]}
                  >
                    Income (+)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Title */}
              <InputField
                label="Transaction Title *"
                value={formTitle}
                onChangeText={(text) => {
                  setFormTitle(text);
                  if (formErrors.title) setFormErrors((p) => ({ ...p, title: null }));
                }}
                placeholder="e.g. Groceries, Rent, Salary"
                icon="pricetag-outline"
                error={formErrors.title}
              />

              {/* Amount in ₹ */}
              <InputField
                label="Amount (₹) *"
                value={formAmount}
                onChangeText={(text) => {
                  setFormAmount(text);
                  if (formErrors.amount) setFormErrors((p) => ({ ...p, amount: null }));
                }}
                placeholder="e.g. 1000.00"
                keyboardType="decimal-pad"
                icon="cash-outline"
                error={formErrors.amount}
              />

              {/* Category Selector */}
              <Text style={styles.inputSectionLabel}>Select Category *</Text>
              <View style={styles.categoryChipsGrid}>
                {categories.map((c) => {
                  const isSelected = formCategory === c.name || formCategory === c.displayName;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setFormCategory(c.name)}
                      style={[
                        styles.catChip,
                        isSelected && styles.catChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          isSelected && styles.catChipTextSelected,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {formErrors.category && (
                <Text style={styles.errorInlineText}>{formErrors.category}</Text>
              )}

              {/* Date */}
              <InputField
                label="Date (YYYY-MM-DD) *"
                value={formDate}
                onChangeText={(text) => {
                  setFormDate(text);
                  if (formErrors.date) setFormErrors((p) => ({ ...p, date: null }));
                }}
                placeholder="YYYY-MM-DD"
                icon="calendar-outline"
                error={formErrors.date}
              />

              {/* Notes */}
              <InputField
                label="Notes (Optional)"
                value={formNotes}
                onChangeText={setFormNotes}
                placeholder="Optional memo or description"
                icon="document-text-outline"
              />

              {/* Save Button */}
              <Button
                title={editingTx ? 'Save Changes' : 'Add Transaction'}
                onPress={handleSaveTransaction}
                variant="primary"
                size="lg"
                style={{ marginTop: 8 }}
              />

              {editingTx && (
                <Button
                  title="Delete Transaction"
                  onPress={() => handleDeleteTransaction(editingTx.id)}
                  variant="danger"
                  size="md"
                  icon="trash-outline"
                  style={{ marginTop: 12, marginBottom: 16 }}
                />
              )}
            </ScrollView>
          </View>
        </View>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.pill,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthDisplayText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
  },
  summaryCard: {
    backgroundColor: colors.darkBlueCard || '#0D2B52',
    borderRadius: borderRadius.card,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignSelf: 'center',
  },
  summaryLabel: {
    fontFamily: typography.medium,
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
  },
  incomeValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 13.5,
    color: '#34D399',
  },
  expenseValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 13.5,
    color: '#F87171',
  },
  netValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 13.5,
    color: '#38BDF8',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.darkText,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  groupSection: {
    marginBottom: 16,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dateGroupTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 13.5,
    color: colors.textMuted,
  },
  itemCountText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 36,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  emptyTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
    marginTop: 12,
  },
  emptySubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: borderRadius.pill,
  },
  floatingAddText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    color: colors.white,
    fontSize: 14,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 34, 36, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.sheet,
    borderTopRightRadius: borderRadius.sheet,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.darkText,
  },
  closeBtn: {
    padding: 6,
  },
  typeSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.pill,
    padding: 4,
    marginBottom: 18,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.blueAmount,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.primary,
  },
  typeBtnText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.darkText,
  },
  typeBtnTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  inputSectionLabel: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 14,
    color: colors.darkText,
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.lightGreen,
    marginRight: 8,
    marginBottom: 8,
  },
  catChipSelected: {
    backgroundColor: colors.primary,
  },
  catChipText: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.darkText,
  },
  catChipTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  errorInlineText: {
    color: colors.danger,
    fontSize: 12.5,
    marginLeft: 6,
    marginBottom: 10,
  },
});

export default TransactionsScreen;
