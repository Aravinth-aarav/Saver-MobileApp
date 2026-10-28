/**
 * SegmentedToggle.js
 * Light-green pill container with a green pill active highlight
 * Options: Daily | Weekly | Monthly
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';

export const SegmentedToggle = ({
  options = ['Daily', 'Weekly', 'Monthly'],
  selected,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => onSelect(option)}
            style={[
              styles.segment,
              isSelected && styles.segmentActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.segmentTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen, // #DFF7E2
    borderRadius: borderRadius.pill,
    padding: 4,
    marginVertical: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
  },
  segmentActive: {
    backgroundColor: colors.primary, // #00D09E
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontFamily: typography.medium,
    fontWeight: '500',
    fontSize: 14,
    color: colors.darkText,
  },
  segmentTextActive: {
    fontFamily: typography.semiBold,
    fontWeight: '700',
    color: colors.white,
  },
});

export default SegmentedToggle;
