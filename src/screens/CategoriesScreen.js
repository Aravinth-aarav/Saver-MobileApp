/**
 * CategoriesScreen.js
 * Customer screen displaying grid of categories:
 * - Food, Transport, Shopping, Bills, Health, Entertainment
 * - Blue icon tile, amount spent, budget, progress bar (<80% green, 80-99% orange, >=100% red)
 * - Tapping navigates to Category Details screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const CategoriesScreen = ({ navigation }) => {
  const { categories, transactions, monthlyBudget } = useFinance();

  // Aggregate total spent across categories
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

  return (
    <View style={styles.container}>
      <Header
        title="Budget Categories"
        subtitle="Spending limits and category thresholds"
        showBack={false}
        navigation={navigation}
        showNotification={true}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Top Overview Banner */}
          <View style={[styles.overviewCard, shadows.card]}>
            <View style={styles.overviewCol}>
              <Text style={styles.overviewLabel}>Total Category Budget</Text>
              <Text style={styles.overviewValBudget}>
                {formatCurrency(totalAllocatedBudget)}
              </Text>
            </View>

            <View style={styles.overviewDivider} />

            <View style={styles.overviewCol}>
              <Text style={styles.overviewLabel}>Total Category Spent</Text>
              <Text style={styles.overviewValSpent}>
                {formatCurrency(totalSpentAcrossCategories)}
              </Text>
            </View>
          </View>

          {/* Section Subtitle */}
          <Text style={styles.sectionTitle}>All Spending Categories</Text>

          {/* Grid / List of Categories */}
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
            />
          ))}

          {/* Extra bottom padding for floating bottom tab bar */}
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
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  overviewCol: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  overviewValBudget: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: colors.darkText,
  },
  overviewValSpent: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: colors.blueAmount,
  },
  overviewDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: 'rgba(5, 34, 36, 0.08)',
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.darkText,
    marginBottom: 12,
    marginLeft: 4,
  },
});

export default CategoriesScreen;
