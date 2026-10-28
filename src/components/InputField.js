/**
 * InputField.js
 * Fintech styled input field with label, left icon, password toggle,
 * and prominent RED inline error text below the input.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
          multiline && { height: numberOfLines * 36, alignItems: 'flex-start', paddingTop: 12 },
          style,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? colors.danger : isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            multiline && { textAlignVertical: 'top' },
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Red inline error text */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: typography.medium,
    fontWeight: '600',
    fontSize: 14,
    color: colors.darkText,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FAFDFB',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF7F7',
  },
  inputDisabled: {
    backgroundColor: '#F5F9F6',
    borderColor: '#E3EBE5',
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.darkText,
    paddingVertical: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 6,
  },
  errorText: {
    fontFamily: typography.regular,
    color: colors.danger,
    fontSize: 12.5,
    fontWeight: '500',
  },
});

export default InputField;
