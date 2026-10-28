/**
 * CategoryCard.js
 * Grid item displaying category icon tile, name, amount spent vs budget, and progress bar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';
import { CategoryProgressBar } from './ProgressBar';

export const CategoryCard = ({
  category,
  spent = 0,
  transactionCount = 0,
  onPress,
  style,
}) => {
  const { displayName, name, icon, budget = 500, color = colors.iconTileBlueMedium } = category;
  const numSpent = Math.abs(spent);
  const percent = budget > 0 ? (numSpent / budget) * 100 : 0;
  const remaining = Math.max(0, budget - numSpent);

  // Status tag
  let badgeText = 'Normal';
  let badgeColor = colors.primary;
  let badgeBg = '#E6FAF3';

  if (percent >= 100) {
    badgeText = 'Over Budget';
    badgeColor = colors.danger;
    badgeBg = '#FFEBEB';
  } else if (percent >= 80) {
    badgeText = 'Warning';
    badgeColor = colors.warning;
    badgeBg = '#FFF4DE';
  }

  const resolveCategoryIcon = (icName) => {
    switch (icName) {
      case 'restaurant':
        return 'restaurant-outline';
      case 'car':
        return 'car-outline';
      case 'cart':
        return 'cart-outline';
      case 'receipt':
        return 'receipt-outline';
      case 'medkit':
        return 'medkit-outline';
      case 'film':
        return 'film-outline';
      default:
        return 'pricetag-outline';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, shadows.card, style]}
    >
      {/* Top row: Icon tile & Status badge */}
      <View style={styles.topRow}>
        <View style={[styles.iconTile, { backgroundColor: color }]}>
          <Ionicons name={resolveCategoryIcon(icon)} size={22} color={colors.white} />
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
        </View>
      </View>

      {/* Title & Count */}
      <Text style={styles.categoryName} numberOfLines={1}>
        {displayName || name}
      </Text>
      <Text style={styles.txCount}>
        {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <CategoryProgressBar percent={percent} height={7} />
      </View>

      {/* Bottom Numbers: Spent & Budget */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.spentLabel}>Spent</Text>
          <Text style={styles.spentValue}>{formatCurrency(numSpent)}</Text>
        </View>

        <View style={styles.rightStat}>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetValue}>{formatCurrency(budget)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card, // ~25px rounded corners
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.05)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  badgeText: {
    fontFamily: typography.semiBold,
    fontSize: 11,
    fontWeight: '700',
  },
  categoryName: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
    marginBottom: 2,
  },
  txCount: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(5, 34, 36, 0.05)',
  },
  spentLabel: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  spentValue: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.blueAmount, // Blue for expenses
  },
  rightStat: {
    alignItems: 'flex-end',
  },
  budgetLabel: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  budgetValue: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.darkText,
  },
});

export default CategoryCard;
