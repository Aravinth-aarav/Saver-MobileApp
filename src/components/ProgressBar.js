/**
 * ProgressBar.js
 * Linear progress bar supporting both:
 * 1) Standard fintech progress bar with dynamic color thresholds
 * 2) Top header style with dark filled % part and white remaining goal amount
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

export const BudgetProgressBar = ({
  percent = 30,
  goalAmount = 20000.0,
}) => {
  const safePercent = Math.min(100, Math.max(0, Math.round(percent)));

  // Dynamic status evaluation
  let statusText = 'Looks Good.';
  let statusColor = colors.darkText;
  let iconName = 'checkmark-circle';

  if (safePercent > 80) {
    statusText = 'Budget Almost Over!';
    statusColor = colors.danger;
    iconName = 'alert-circle';
  } else if (safePercent >= 50) {
    statusText = 'Be Careful.';
    statusColor = '#D47E00';
    iconName = 'warning';
  }

  return (
    <View style={styles.headerBarWrapper}>
      {/* Visual Bar: dark filled on left, white on right */}
      <View style={styles.track}>
        {/* Dark filled part showing % on left */}
        <View style={[styles.filledDark, { width: `${Math.max(16, safePercent)}%` }]}>
          <Text style={styles.percentText}>{safePercent}%</Text>
        </View>

        {/* White remaining part with goal amount on right */}
        <View style={styles.remainingWhite}>
          <Text style={styles.goalText}>{formatCurrency(goalAmount)}</Text>
        </View>
      </View>

      {/* Dynamic message below progress bar */}
      <View style={styles.statusRow}>
        <Ionicons name={iconName} size={16} color={statusColor} style={styles.statusIcon} />
        <Text style={[styles.statusMessage, { color: statusColor }]}>
          {safePercent}% Of Your Expenses, {statusText}
        </Text>
      </View>
    </View>
  );
};

export const CategoryProgressBar = ({
  percent = 0,
  height = 8,
  showLabel = false,
  style,
}) => {
  const safePercent = Math.min(100, Math.max(0, Math.round(percent)));

  let fillColor = colors.primary; // Under 80%
  if (percent >= 100) {
    fillColor = colors.danger; // Over 100%
  } else if (percent >= 80) {
    fillColor = colors.warning; // 80-99%
  }

  return (
    <View style={style}>
      <View style={[styles.catTrack, { height }]}>
        <View
          style={[
            styles.catFill,
            { width: `${safePercent}%`, backgroundColor: fillColor, height },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.catPercentText, { color: fillColor }]}>
          {Math.round(percent)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerBarWrapper: {
    marginTop: 14,
    marginBottom: 6,
    width: '100%',
  },
  track: {
    height: 38,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  filledDark: {
    height: '100%',
    backgroundColor: '#052224', // Dark filled part
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderTopLeftRadius: borderRadius.pill,
    borderBottomLeftRadius: borderRadius.pill,
  },
  percentText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    color: colors.white,
    fontSize: 13,
  },
  remainingWhite: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 14,
  },
  goalText: {
    fontFamily: typography.semiBold,
    fontWeight: '700',
    color: '#052224',
    fontSize: 13.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 4,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusMessage: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 12.5,
  },
  catTrack: {
    backgroundColor: '#DFF7E2',
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  catFill: {
    borderRadius: borderRadius.pill,
  },
  catPercentText: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
});

export default BudgetProgressBar;
