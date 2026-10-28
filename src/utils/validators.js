/**
 * validators.js
 * Form validation utilities with clear inline red error messages
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return 'Phone number must be exactly 10 digits.';
  }
  return null;
};

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }
  return null;
};

export const validateAmount = (amount) => {
  if (amount === undefined || amount === null || String(amount).trim() === '') {
    return 'Amount is required.';
  }
  const num = Number(amount);
  if (isNaN(num)) {
    return 'Amount must be a valid number.';
  }
  if (num <= 0) {
    return 'Amount must be greater than $0.00.';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || !String(value).trim()) {
    return `${fieldName} is required.`;
  }
  return null;
};
