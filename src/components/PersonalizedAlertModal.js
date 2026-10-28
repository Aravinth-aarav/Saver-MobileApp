/**
 * PersonalizedAlertModal.js
 * Interactive modal displaying personalized notifications and budget alerts:
 * e.g. "Hey Priya, your Food expense of $50 was added. You have $2,500 left this month."
 * and category budget warnings (80% / 100%).
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

export const PersonalizedAlertModal = ({
  visible,
  alertData, // { title, message, type: 'success' | 'warning' | 'danger' }
  onDismiss,
}) => {
  if (!visible || !alertData) return null;

  const { title, message, type = 'success' } = alertData;

  const getIconProps = () => {
    switch (type) {
      case 'danger':
        return {
          name: 'alert-circle',
          color: colors.danger,
          bg: '#FFE8E8',
        };
      case 'warning':
        return {
          name: 'warning',
          color: colors.warning,
          bg: '#FFF4E0',
        };
      default:
        return {
          name: 'checkmark-circle',
          color: colors.primary,
          bg: '#E2FBE9',
        };
    }
  };

  const iconInfo = getIconProps();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, shadows.card]}>
          {/* Top Icon Badge */}
          <View style={[styles.iconBadge, { backgroundColor: iconInfo.bg }]}>
            <Ionicons name={iconInfo.name} size={36} color={iconInfo.color} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Personalized Message Body */}
          <Text style={styles.message}>{message}</Text>

          {/* Action Button */}
          <Button
            title="Got it, thanks!"
            onPress={onDismiss}
            variant={type === 'danger' ? 'danger' : 'primary'}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 34, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card, // ~25px
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 18,
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontFamily: typography.regular,
    fontSize: 14.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  actionBtn: {
    width: '100%',
  },
});

export default PersonalizedAlertModal;
