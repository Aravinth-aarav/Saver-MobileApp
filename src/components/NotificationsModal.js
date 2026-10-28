/**
 * NotificationsModal.js
 * Dedicated real-time activity and alerts modal for Saver.
 * Displays all notifications triggered by user actions:
 * - Adding, editing, and deleting transactions
 * - 80% and 100% category budget threshold warnings
 * - Monthly and category budget modifications
 * - Unread badges, relative timestamps, and one-tap "Mark Read" / "Clear" actions.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatRelativeTime } from '../utils/formatters';

export const NotificationsModal = ({ visible, onClose }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useFinance();

  if (!visible) return null;

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'danger':
        return {
          bg: '#FFEAEA',
          color: colors.danger,
          iconName: 'alert-circle',
        };
      case 'warning':
        return {
          bg: '#FFF4E0',
          color: colors.warning,
          iconName: 'warning',
        };
      case 'success':
        return {
          bg: '#DFF7E2',
          color: colors.primary,
          iconName: 'checkmark-circle',
        };
      default:
        return {
          bg: '#E8F2FF',
          color: colors.blueAmount,
          iconName: 'notifications',
        };
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheetContainer, shadows.card]}>
          {/* Top Drag Handle Indicator */}
          <View style={styles.dragHandle} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <View style={styles.bellBadge}>
                <Ionicons name="notifications" size={18} color={colors.white} />
              </View>
              <View>
                <Text style={styles.sheetTitle}>Activity & Alerts</Text>
                <Text style={styles.sheetSubtitle}>
                  {unreadNotificationsCount > 0
                    ? `${unreadNotificationsCount} unread notification${unreadNotificationsCount > 1 ? 's' : ''}`
                    : 'All caught up'}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsRow}>
              {unreadNotificationsCount > 0 && (
                <TouchableOpacity
                  onPress={markAllNotificationsAsRead}
                  style={styles.actionPill}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-done" size={14} color={colors.primary} />
                  <Text style={styles.actionPillText}>Read All</Text>
                </TouchableOpacity>
              )}

              {notifications.length > 0 && (
                <TouchableOpacity
                  onPress={clearNotifications}
                  style={[styles.actionPill, styles.clearPill]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={14} color={colors.danger} />
                  <Text style={[styles.actionPillText, { color: colors.danger }]}>Clear</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeCircle}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.darkText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="notifications-off-outline" size={38} color={colors.textLight} />
                </View>
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptySubtitle}>
                  Whenever you add, edit, or delete transactions, or when budget threshold warnings occur, alerts will appear here in real-time.
                </Text>
              </View>
            ) : (
              notifications.map((item) => {
                const badge = getBadgeStyle(item.type);
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.notifCard,
                      !item.read && styles.notifCardUnread,
                    ]}
                  >
                    {/* Icon Tile */}
                    <View style={[styles.iconTile, { backgroundColor: badge.bg }]}>
                      <Ionicons
                        name={item.icon || badge.iconName}
                        size={20}
                        color={badge.color}
                      />
                    </View>

                    {/* Content */}
                    <View style={styles.notifContent}>
                      <View style={styles.cardTopRow}>
                        <Text style={styles.notifTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {!item.read && <View style={styles.unreadDot} />}
                      </View>

                      <Text style={styles.notifMessage}>{item.message}</Text>

                      <View style={styles.cardBottomRow}>
                        <Ionicons name="time-outline" size={12} color={colors.textLight} />
                        <Text style={styles.notifTime}>
                          {item.time || formatRelativeTime(item.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom Dismiss Button */}
          <TouchableOpacity
            style={styles.dismissButton}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.dismissButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 34, 36, 0.55)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '82%',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  dragHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: 'rgba(5, 34, 36, 0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(5, 34, 36, 0.06)',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bellBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sheetTitle: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 17,
    color: colors.darkText,
  },
  sheetSubtitle: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.lightGreen,
    marginRight: 6,
  },
  clearPill: {
    backgroundColor: '#FFEAEA',
  },
  actionPillText: {
    fontFamily: typography.semiBold,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 3,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 34, 36, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  scrollList: {
    paddingVertical: 6,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.05)',
  },
  notifCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 208, 158, 0.35)',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.darkText,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blueAmount,
    marginLeft: 6,
  },
  notifMessage: {
    fontFamily: typography.regular,
    fontSize: 12.5,
    color: colors.darkText,
    opacity: 0.82,
    lineHeight: 18,
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifTime: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(5, 34, 36, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  dismissButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dismissButtonText: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 15,
    color: colors.white,
  },
});

export default NotificationsModal;
