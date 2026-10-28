/**
 * CategoryCard.js
 * Enhanced Category Card with:
 * - Modern solid filled icons (fast-food, car-sport, cart, receipt, medical, videocam)
 * - Tactile spring press animation
 * - Glowing icon tile and clean typography
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatINR } from '../utils/formatters';
import { CategoryProgressBar } from './ProgressBar';

export const CategoryCard = ({
  category,
  spent = 0,
  transactionCount = 0,
  onPress,
  style,
}) => {
  const { displayName, name, icon, budget = 5000, color = colors.iconTileBlueMedium } = category;
  const numSpent = Math.abs(spent);
  const percent = budget > 0 ? (numSpent / budget) * 100 : 0;

  // Press Animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.965,
      speed: 22,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 22,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

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

  // Modern styled filled icons
  const resolveCategoryIcon = (icName) => {
    switch (icName) {
      case 'restaurant':
        return 'fast-food';
      case 'car':
        return 'car-sport';
      case 'cart':
        return 'cart';
      case 'receipt':
        return 'receipt';
      case 'medkit':
        return 'medical';
      case 'film':
        return 'videocam';
      default:
        return 'pricetag';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, shadows.card, style]}
      >
        {/* Top row: Styled Icon tile & Status badge */}
        <View style={styles.topRow}>
          <View style={[styles.iconTile, { backgroundColor: color, shadowColor: color }]}>
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
          <CategoryProgressBar percent={percent} height={7.5} />
        </View>

        {/* Bottom Numbers: Spent & Budget */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.spentLabel}>Spent</Text>
            <Text style={styles.spentValue}>{formatINR(numSpent)}</Text>
          </View>

          <View style={styles.rightStat}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetValue}>{formatINR(budget)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
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
    width: 46,
    height: 46,
    borderRadius: borderRadius.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
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
    fontSize: 14.5,
    color: colors.blueAmount,
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
    fontSize: 14.5,
    color: colors.darkText,
  },
});

export default CategoryCard;
