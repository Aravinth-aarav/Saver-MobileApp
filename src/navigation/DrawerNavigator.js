/**
 * DrawerNavigator.js
 * Drawer wrapping the BottomTabNavigator for Saver:
 * - Header shows user name, avatar, and role badge
 * - Items: Dashboard, Profile (Customer), About Saver, Logout
 * - Opens by swiping from left edge and tapping menu icon in Header
 * - Logout resets state back to Home landing screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import BottomTabNavigator from './BottomTabNavigator';
import AboutScreen from '../screens/AboutScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { currentUser, role, logout } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <SafeAreaView style={styles.drawerSafeArea}>
      {/* Header with user info */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerAvatar}>
          <Text style={styles.drawerAvatarText}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>

        <Text style={styles.drawerUserName}>{currentUser?.name || 'Saver User'}</Text>
        <Text style={styles.drawerUserEmail}>{currentUser?.email}</Text>

        <View style={styles.drawerRolePill}>
          <Text style={styles.drawerRoleText}>
            {role ? role.toUpperCase() : 'CUSTOMER'}
          </Text>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* 1. Dashboard */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'DashboardTab' })}
        >
          <View style={[styles.itemIconBox, { backgroundColor: '#E2FBE9' }]}>
            <Ionicons name="home-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.drawerItemText}>Dashboard</Text>
        </TouchableOpacity>

        {/* 2. Profile (Customer only) */}
        {!isAdmin && (
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          >
            <View style={[styles.itemIconBox, { backgroundColor: '#E8F2FF' }]}>
              <Ionicons name="person-outline" size={20} color={colors.blueAmount} />
            </View>
            <Text style={styles.drawerItemText}>Profile & Settings</Text>
          </TouchableOpacity>
        )}

        {/* 3. About Saver */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('About')}
        >
          <View style={[styles.itemIconBox, { backgroundColor: '#FFF4E0' }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.warning} />
          </View>
          <Text style={styles.drawerItemText}>About Saver</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 4. Logout (resets back to Home landing screen) */}
        <TouchableOpacity
          style={[styles.drawerItem, { marginTop: 10 }]}
          onPress={() => {
            props.navigation.closeDrawer();
            logout();
          }}
        >
          <View style={[styles.itemIconBox, { backgroundColor: '#FFEBEB' }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </View>
          <Text style={[styles.drawerItemText, { color: colors.danger }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <Text style={styles.footerBrand}>Saver — Smart Budgeting</Text>
        <Text style={styles.footerNote}>College Hackathon Exam v1.0</Text>
      </View>
    </SafeAreaView>
  );
}

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.white,
          width: 300,
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
        },
        drawerType: 'front',
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerSafeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
    borderBottomRightRadius: 32,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  drawerAvatarText: {
    fontFamily: typography.bold,
    fontSize: 26,
    color: colors.primary,
    fontWeight: '800',
  },
  drawerUserName: {
    fontFamily: typography.bold,
    fontWeight: '800',
    fontSize: 18,
    color: colors.darkText,
  },
  drawerUserEmail: {
    fontFamily: typography.regular,
    fontSize: 12.5,
    color: 'rgba(5, 34, 36, 0.75)',
    marginTop: 2,
  },
  drawerRolePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.darkText,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    marginTop: 10,
  },
  drawerRoleText: {
    fontFamily: typography.semiBold,
    fontSize: 10,
    color: colors.white,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    marginBottom: 6,
  },
  itemIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  drawerItemText: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 15,
    color: colors.darkText,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(5, 34, 36, 0.08)',
    marginVertical: 14,
    marginHorizontal: 8,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(5, 34, 36, 0.05)',
  },
  footerBrand: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.darkText,
  },
  footerNote: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default DrawerNavigator;
