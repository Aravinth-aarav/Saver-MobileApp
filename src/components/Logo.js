/**
 * Logo.js
 * Reusable Saver brand logo built entirely in code:
 * A rupee symbol (₹) inside a rounded green badge/circle with bold Poppins "Saver" text.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';

export const Logo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  layout = 'vertical', // 'vertical' | 'horizontal'
  showText = true,
  textColor = colors.darkText,
  badgeBg = colors.primary,
  symbolColor = colors.white,
  style,
}) => {
  // Dimension tokens
  let circleSize = 64;
  let symbolFontSize = 32;
  let brandFontSize = 24;

  if (size === 'sm') {
    circleSize = 38;
    symbolFontSize = 20;
    brandFontSize = 18;
  } else if (size === 'lg') {
    circleSize = 84;
    symbolFontSize = 44;
    brandFontSize = 30;
  } else if (size === 'xl') {
    circleSize = 104;
    symbolFontSize = 54;
    brandFontSize = 36;
  }

  return (
    <View
      style={[
        styles.container,
        layout === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    >
      {/* Rounded Green Badge Circle */}
      <View
        style={[
          styles.badgeCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: badgeBg,
          },
        ]}
      >
        <Text style={[styles.symbolText, { fontSize: symbolFontSize, color: symbolColor }]}>
          ₹
        </Text>
      </View>

      {/* Brand Text: Saver */}
      {showText && (
        <View style={layout === 'horizontal' ? styles.horizontalTextCol : styles.verticalTextCol}>
          <Text
            style={[
              styles.brandText,
              { fontSize: brandFontSize, color: textColor },
            ]}
          >
            Saver
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  badgeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  symbolText: {
    fontFamily: typography.bold,
    fontWeight: '800',
    includeFontPadding: false,
    lineHeight: undefined,
  },
  horizontalTextCol: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  verticalTextCol: {
    marginTop: 12,
    alignItems: 'center',
  },
  brandText: {
    fontFamily: typography.bold,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

export default Logo;
