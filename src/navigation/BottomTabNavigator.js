/**
 * BottomTabNavigator.js
 * Custom styled fintech bottom tab navigation:
 * - Rounded light-green container (#DFF7E2)
 * - Active tab gets a green rounded-square background (#00D09E)
 * - Customer sees all 5 tabs (Home, Analysis, Transactions, Categories, Profile)
 * - Admin sees only 2 tabs (Home, Analysis)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, borderRadius, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom Floating Tab Bar
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={[styles.tabBarContainer, shadows.card]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Icon resolver
          let iconName = 'home';
          if (route.name === 'HomeTab') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'AnalysisTab') {
            iconName = isFocused ? 'stats-chart' : 'analytics-outline';
          } else if (route.name === 'TransactionsTab') {
            iconName = isFocused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'CategoriesTab') {
            iconName = isFocused ? 'layers' : 'layers-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = isFocused ? 'person' : 'person-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {/* Active Tab: Green rounded-square background */}
              <View
                style={[
                  styles.iconTile,
                  isFocused && styles.activeIconTile,
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.white : colors.darkText}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export const BottomTabNavigator = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. Home Tab (Both Admin & Customer) */}
      <Tab.Screen name="HomeTab" component={HomeScreen} />

      {/* 2. Analysis Tab (Both Admin & Customer) */}
      <Tab.Screen name="AnalysisTab" component={AnalysisScreen} />

      {/* Tabs 3, 4, 5: Customer Only */}
      {!isAdmin && (
        <>
          <Tab.Screen name="TransactionsTab" component={TransactionsScreen} />
          <Tab.Screen name="CategoriesTab" component={CategoriesScreen} />
          <Tab.Screen name="ProfileTab" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen, // #DFF7E2 light green container
    borderRadius: borderRadius.pill,    // Rounded container
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.iconTile, // Rounded-square tile
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeIconTile: {
    backgroundColor: colors.primary, // Green rounded-square active background (#00D09E)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
});

export default BottomTabNavigator;
