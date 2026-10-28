/**
 * CategoriesScreen.js
 * Customer screen displaying grid of categories in Indian Rupees (₹):
 * Food, Transport, Shopping, Bills, Health, Entertainment.
 * Features:
 * - Dynamic category cards with progress bars and status tags
 * - Quick Edit Budget modal to adjust limits for any category in real-time
 * - Automatic persistence and live alerts to the Bell notification center
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

export const CategoriesScreen = ({ navigation }) => {
  const { categories, transactions, updateCategoryBudget } = useFinance();

  // Edit Budget Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetError, setBudgetError] = useState('');

  let totalSpentAcrossCategories = 0;
  let totalAllocatedBudget = 0;

  const enrichedCategories = categories.map((cat) => {
    let spent = 0;
    let count = 0;

    transactions.forEach((tx) => {
      if (
        tx.type === 'expense' &&
        (tx.categoryGroup === cat.name ||
         tx.categoryGroup === cat.displayName ||
         tx.category === cat.name)
      ) {
        spent += Math.abs(Number(tx.amount) || 0);
        count += 1;
      }
    });

    totalSpentAcrossCategories += spent;
    totalAllocatedBudget += (cat.budget || 0);

    return {
      ...cat,
      spent,
      transactionCount: count,
    };
  });

  const handleOpenEdit = (cat) => {
    setSelectedCat(cat);
    setBudgetInput(String(cat.budget || 5000));
    setBudgetError('');
    setEditModalVisible(true);
  };

  const handleSaveBudget = async () => {
    const val = Number(budgetInput.trim());
    if (isNaN(val) || val <= 0) {
      setBudgetError('Please enter a valid positive budget amount');
      return;
    }

    if (selectedCat) {
      await updateCategoryBudget(selectedCat.id, val);
      setEditModalVisible(false);
      setSelectedCat(null);
    }
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
        title="Budget Categories"
        subtitle="Spending limits in Indian Rupees (₹)"
        showBack={false}
        navigation={navigation}
        showNotification={true}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Top Overview Banner in ₹ */}
          <View style={[styles.overviewCard, shadows.card]}>
            <View style={styles.overviewCol}>
              <Text style={styles.overviewLabel}>Total Category Budget</Text>
              <Text style={styles.overviewValBudget}>
                {formatINR(totalAllocatedBudget)}
              </Text>
            </View>

            <View style={styles.overviewDivider} />

            <View style={styles.overviewCol}>
              <Text style={styles.overviewLabel}>Total Category Spent</Text>
              <Text style={styles.overviewValSpent}>
                {formatINR(totalSpentAcrossCategories)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>All Spending Categories</Text>
            <Text style={styles.sectionSubtitle}>Tap "Edit Budget" to adjust limits</Text>
          </View>

          {/* Grid of Category Cards with Edit Budget option */}
          {enrichedCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              spent={cat.spent}
              transactionCount={cat.transactionCount}
              onPress={() => {
                navigation.navigate('CategoryDetails', {
                  categoryId: cat.id,
                  categoryName: cat.name,
                  displayName: cat.displayName,
                });
              }}
              onEditPress={handleOpenEdit}
            />
          ))}

          <View style={{ height: 80 }} />
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

          <View style={[styles.modalCard, shadows.card]}>
            <View style={styles.modalDragHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <View style={styles.modalIconTile}>
                  <Ionicons name="options" size={20} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Adjust Category Budget</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedCat?.displayName || selectedCat?.name || 'Category'}
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

            {/* Current Spending Info */}
            <View style={styles.spentInfoBox}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={styles.spentInfoText}>
                Current Total Spent: {formatINR(selectedCat?.spent || 0)}
              </Text>
            </View>

            {/* Rupee Input Field */}
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

            {/* Actions */}
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
  overviewCard: {
    backgroundColor: colors.darkBlueCard || '#0D2B52',
    borderRadius: borderRadius.card,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  overviewCol: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
  },
  overviewValBudget: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: '#38BDF8',
  },
  overviewValSpent: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: '#F87171',
  },
  overviewDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  sectionHeaderRow: {
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.darkText,
  },
  sectionSubtitle: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
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

export default CategoriesScreen;
