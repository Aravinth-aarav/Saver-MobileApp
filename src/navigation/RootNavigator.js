/**
 * RootNavigator.js
 * Master Stack Navigator coordinating:
 * 1. Auth Flow: Welcome -> SignIn -> SignUp
 * 2. Main App: DrawerNavigator (containing BottomTabNavigator) +
 *    EditProfile and CategoryDetails stack screens.
 * Every screen is reachable and back navigation works seamlessly.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

// Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Main App Navigation & Screens
import DrawerNavigator from './DrawerNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Unauthenticated Stack
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        ) : (
          // Authenticated Stack
          <Stack.Group>
            {/* Drawer wraps Bottom Tabs */}
            <Stack.Screen name="AppDrawer" component={DrawerNavigator} />

            {/* Sub-screens reachable via navigation */}
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="CategoryDetails"
              component={CategoryDetailsScreen}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;
