/**
 * Card.js
 * Reusable Card component with 25px rounded corners and subtle fintech elevation
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows } from '../constants/theme';

export const Card = ({
  children,
  style,
  onPress,
  variant = 'surface', // 'surface' | 'mint' | 'lightGreen' | 'primary'
  padding = 18,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'mint':
        return colors.background;
      case 'lightGreen':
        return colors.lightGreen;
      case 'primary':
        return colors.primary;
      default:
        return colors.surface;
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      padding,
    },
    shadows.card,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card, // ~25px
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
    overflow: 'hidden',
  },
});

export default Card;
