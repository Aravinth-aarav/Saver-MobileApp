/**
 * ProfileScreen.js
 * Customer profile screen showing user avatar, name, email, phone,
 * monthly budget goal in Indian Rupees (₹), and quick navigation links.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../utils/formatters';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout, role } = useAuth();
  const { monthlyBudget, transactions, categories } = useFinance();

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P';

  return (
    <View style={styles.container}>
      <Header
        title="Profile & Settings"
        subtitle="Manage your personal Saver account"
        showBack={false}
        navigation={navigation}
        showNotification={false}
      />

      <View style={styles.mintSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* User Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.avatarSection}>
              {currentUser?.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{userInitial}</Text>
                </View>
              )}

              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {role ? role.toUpperCase() : 'CUSTOMER'}
                </Text>
              </View>
            </View>

            <Text style={styles.userName}>{currentUser?.name || 'Priya Sharma'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'customer@demo.com'}</Text>
            <Text style={styles.userPhone}>
              📞 +91 {currentUser?.phone || '9876543210'}
            </Text>

            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
              variant="outline"
              size="sm"
              icon="create-outline"
              style={{ marginTop: 14 }}
            />
          </Card>

          {/* Monthly Budget Card in ₹ */}
          <Card style={styles.budgetCard}>
            <View style={styles.budgetLeft}>
              <View style={styles.budgetIconCircle}>
                <Text style={{ fontSize: 22, color: colors.primary, fontWeight: '800' }}>₹</Text>
              </View>
              <View>
                <Text style={styles.budgetLabel}>Monthly Budget Limit</Text>
                <Text style={styles.budgetValue}>{formatINR(monthlyBudget)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.changeBtn}
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </Card>

          {/* Quick Stats Grid */}
          <Text style={styles.sectionHeading}>Activity Overview</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, shadows.card]}>
              <Ionicons name="swap-horizontal" size={22} color={colors.blueAmount} />
              <Text style={styles.statBoxNum}>{transactions.length}</Text>
              <Text style={styles.statBoxLabel}>Total Transactions</Text>
            </View>

            <View style={[styles.statBox, shadows.card]}>
              <Ionicons name="layers-outline" size={22} color={colors.primary} />
              <Text style={styles.statBoxNum}>{categories.length}</Text>
              <Text style={styles.statBoxLabel}>Active Categories</Text>
            </View>
          </View>

          {/* Preferences */}
          <Text style={styles.sectionHeading}>Preferences</Text>
          <Card style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="information-circle-outline" size={20} color={colors.darkText} />
                <Text style={styles.menuItemText}>About Saver App</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (navigation && navigation.openDrawer) {
                  navigation.openDrawer();
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="menu-outline" size={20} color={colors.darkText} />
                <Text style={styles.menuItemText}>Open Side Navigation Drawer</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          </Card>

          {/* Logout Button (resets to Home landing screen) */}
          <Button
            title="Log Out"
            onPress={logout}
            variant="danger"
            size="md"
            icon="log-out-outline"
            style={{ marginTop: 20 }}
          />

          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  mintSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.sheet,
    borderTopRightRadius: borderRadius.sheet,
    marginTop: -20,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: typography.bold,
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: colors.darkText,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  roleBadgeText: {
    fontFamily: typography.semiBold,
    fontSize: 9.5,
    color: colors.white,
    fontWeight: '700',
  },
  userName: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkText,
    marginTop: 8,
  },
  userEmail: {
    fontFamily: typography.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  userPhone: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.darkText,
    marginTop: 4,
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  budgetLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  budgetValue: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: colors.darkText,
  },
  changeBtn: {
    backgroundColor: colors.lightGreen,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.pill,
  },
  changeBtnText: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  sectionHeading: {
    fontFamily: typography.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkText,
    marginBottom: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(5, 34, 36, 0.04)',
  },
  statBoxNum: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 20,
    color: colors.darkText,
    marginTop: 6,
  },
  statBoxLabel: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  menuCard: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.darkText,
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(5, 34, 36, 0.06)',
  },
});

export default ProfileScreen;
