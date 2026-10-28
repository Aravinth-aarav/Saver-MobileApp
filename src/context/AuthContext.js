/**
 * AuthContext.js
 * Authentication and Role state for Saver app:
 * - Boot policy: opens directly on Home landing screen (no auto-login)
 * - Sign In & Sign Up for Customer & Admin
 * - Saved registered users in AsyncStorage
 * - Logout resets back to Home landing screen
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_USERS } from '../constants/dummyData';

const AUTH_STORAGE_KEY = '@saver_user_session';
const USERS_STORAGE_KEY = '@saver_registered_users';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Starts as null so app opens on Home landing screen
  const [isLoading, setIsLoading] = useState(true);

  // Initialize storage seeds
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (!savedUsersJson) {
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
        }
        // Notice: No auto-login on initial scan per exam specification!
      } catch (error) {
        console.error('Failed to initialize auth storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user with email, password, and expected role
   */
  const login = async (email, password, role) => {
    try {
      const savedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const allUsers = savedUsersJson ? JSON.parse(savedUsersJson) : DEMO_USERS;

      const normalizedEmail = email.trim().toLowerCase();
      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (!matchedUser) {
        return { success: false, message: 'Invalid email or password.' };
      }

      if (matchedUser.role !== role) {
        return {
          success: false,
          message: `This account is registered as ${matchedUser.role.toUpperCase()}. Please switch role to ${matchedUser.role}.`,
        };
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
      setCurrentUser(matchedUser);
      return { success: true, user: matchedUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred during login.' };
    }
  };

  /**
   * Register new account
   */
  const signup = async ({ name, email, phone, password, role }) => {
    try {
      const savedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const allUsers = savedUsersJson ? JSON.parse(savedUsersJson) : [...DEMO_USERS];

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
        role,
        monthlyBudget: 35000.00,
      };

      allUsers.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Failed to create account.' };
    }
  };

  /**
   * Logout user and return to Home landing screen
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Update profile info
   */
  const updateProfile = async (updatedFields) => {
    try {
      if (!currentUser) return { success: false };

      const updatedUser = { ...currentUser, ...updatedFields };

      const savedUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const allUsers = savedUsersJson ? JSON.parse(savedUsersJson) : [...DEMO_USERS];
      const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Could not update profile.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
