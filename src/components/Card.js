/**
 * Card.js
 * Enhanced Card component with:
 * - Support for 'darkBlue' variant
 * - Smooth touch scale spring animation
 * - Subtle elevation and rounded corners
 */

import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, borderRadius, shadows } from '../constants/theme';

export const Card = ({
  children,
  style,
  onPress,
  variant = 'surface', // 'surface' | 'mint' | 'lightGreen' | 'primary' | 'darkBlue'
  padding = 18,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'darkBlue':
        return colors.darkBlueCard || '#0D2B52';
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

  const isDarkBlue = variant === 'darkBlue';

  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      padding,
      borderColor: isDarkBlue ? 'rgba(255, 255, 255, 0.12)' : 'rgba(5, 34, 36, 0.04)',
    },
    shadows.card,
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyle}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card, // ~25px
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
