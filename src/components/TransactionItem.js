/**
 * TransactionItem.js
 * Enhanced single transaction row with:
 * - Solid styled modern icons
 * - Spring touch animation
 * - Clean metadata, dividers, and Rupee (₹) formatting
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatINR, formatDateTime } from '../utils/formatters';

export const TransactionItem = ({
  transaction,
  onPress,
  onLongPress,
}) => {
  const {
    title,
    amount,
    type,
    category,
    date,
    time,
    icon = 'wallet',
    tileColor = colors.iconTileBlueMedium,
  } = transaction;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const isIncome = type === 'income' || amount > 0;
  const numAmount = Number(amount);
  const tileBg = tileColor || (isIncome ? colors.iconTileBlueDark : colors.iconTileBlueMedium);

  let formattedTimeDate = '';
  if (time && date) {
    const d = new Date(date);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    formattedTimeDate = `${time} - ${monthNames[d.getMonth()] || 'Apr'} ${d.getDate() || '30'}`;
  } else {
    formattedTimeDate = formatDateTime(date) || '18:27 - April 30';
  }

  // Modern solid styled icons
  const resolveIconName = (name) => {
    if (!name) return 'receipt';
    if (name.includes('car')) return 'car-sport';
    if (name.includes('cart') || name.includes('pantry') || name.includes('grocer')) return 'cart';
    if (name.includes('wallet') || name.includes('salary') || name.includes('cash')) return 'cash';
    if (name.includes('home') || name.includes('rent')) return 'home';
    if (name.includes('cafe') || name.includes('food')) return 'fast-food';
    if (name.includes('bill') || name.includes('flash')) return 'flash';
    if (name.includes('medkit') || name.includes('health') || name.includes('pharmacy')) return 'medical';
    if (name.includes('film') || name.includes('movie')) return 'videocam';
    return name.replace('-outline', '');
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={onLongPress}
        style={styles.container}
      >
        {/* 1. Rounded-Square Blue Icon Tile with shadow */}
        <View style={[styles.iconTile, { backgroundColor: tileBg, shadowColor: tileBg }]}>
          <Ionicons name={resolveIconName(icon)} size={22} color={colors.white} />
        </View>

        {/* 2. Middle Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.timeDateText}>
              {formattedTimeDate}
            </Text>

            <View style={styles.metaDivider} />

            <Text style={styles.categoryText} numberOfLines={1}>
              {category}
            </Text>
          </View>
        </View>

        {/* 3. Amount on Right: Income dark, Expenses blue with minus */}
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              isIncome ? styles.incomeText : styles.expenseText,
            ]}
          >
            {formatINR(numAmount, { showExplicitPlus: true })}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
    shadowColor: '#052224',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.darkText,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDateText: {
    fontFamily: typography.semiBold,
    fontWeight: '700',
    fontSize: 11.5,
    color: colors.blueAmount,
  },
  metaDivider: {
    width: 1,
    height: 11,
    backgroundColor: 'rgba(5, 34, 36, 0.22)',
    marginHorizontal: 8,
  },
  categoryText: {
    fontFamily: typography.medium,
    fontWeight: '500',
    fontSize: 12,
    color: colors.textMuted,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  amountText: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 15.5,
  },
  incomeText: {
    color: colors.darkText,
  },
  expenseText: {
    color: colors.blueAmount,
  },
});

export default TransactionItem;
