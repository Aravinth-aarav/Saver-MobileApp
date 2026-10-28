/**
 * CircularProgress.js
 * SVG circular progress ring with centered car icon
 * Used for "Savings On Goals" card on the Home screen
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const CircularProgress = ({
  size = 80,
  strokeWidth = 7,
  percentage = 70,
  iconName = 'car',
  iconColor = '#052224',
  ringColor = '#052224',
  trackColor = 'rgba(255, 255, 255, 0.4)',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (circumference * safePercentage) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
      {/* Centered Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={size * 0.38} color={iconColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircularProgress;
