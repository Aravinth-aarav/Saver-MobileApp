/**
 * RootNavigator.js
 * Master Stack Navigator coordinating Saver:
 * 1. Root Stack: Home (landing) -> Login -> SignUp
 * 2. Authenticated Stack: AppDrawer (Drawer wrapping Bottom Tabs with Dashboard) +
 *    EditProfile and CategoryDetails.
 * 3. Logout completely resets state back to Home landing screen.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

// Public Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Authenticated Main App Navigation & Sub-screens
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
          // Unauthenticated Stack: Starts on Home landing screen
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        ) : (
          // Authenticated Stack: Takes user directly to Dashboard (in Drawer)
          <Stack.Group>
            <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
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
