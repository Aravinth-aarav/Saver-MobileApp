/**
 * CategoriesScreen.js
 * Customer screen displaying grid of categories in Indian Rupees (₹):
 * Food, Transport, Shopping, Bills, Health, Entertainment.
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
import { formatINR } from '../utils/formatters';

export const CategoriesScreen = ({ navigation }) => {
  const { categories, transactions } = useFinance();

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

          <Text style={styles.sectionTitle}>All Spending Categories</Text>

          {/* Grid of Category Cards */}
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
