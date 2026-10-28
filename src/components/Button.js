/**
 * Button.js
 * Pill-shaped fintech action button with smooth press states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    let bg = colors.primary;
    let border = 'transparent';

    switch (variant) {
      case 'secondary':
        bg = colors.lightGreen;
        break;
      case 'outline':
        bg = 'transparent';
        border = colors.primary;
        break;
      case 'danger':
        bg = colors.danger;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
      default:
        bg = colors.primary;
    }

    let padV = 14;
    let padH = 24;
    if (size === 'sm') {
      padV = 9;
      padH = 16;
    } else if (size === 'lg') {
      padV = 18;
      padH = 32;
    }

    return {
      backgroundColor: disabled ? '#C8D8CE' : bg,
      borderColor: disabled ? '#C8D8CE' : border,
      borderWidth: variant === 'outline' ? 1.5 : 0,
      paddingVertical: padV,
      paddingHorizontal: padH,
    };
  };

  const getTextColor = () => {
    if (disabled) return '#8A9E92';
    switch (variant) {
      case 'secondary':
        return colors.darkText;
      case 'outline':
        return colors.primary;
      case 'danger':
      case 'primary':
        return colors.white;
      case 'ghost':
        return colors.darkText;
      default:
        return colors.white;
    }
  };

  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyles(),
        variant === 'primary' && !disabled ? shadows.button : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={fontSize + 2}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={fontSize + 2}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.pill, // Pill-shaped everywhere
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.semiBold,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
