/**
 * formatters.js
 * Helpers for Indian Rupee (₹) formatting with Indian digit grouping,
 * dates, times, and dynamic time-of-day greetings.
 * Pure JavaScript - Does NOT rely on Intl for Hermes/React Native compatibility.
 */

/**
 * Formats numbers into Indian Rupee (₹) currency with Indian grouping:
 * e.g. ₹1,25,000.00 | ₹77,830.00 | -₹1,000.00 | +₹40,000.00
 */
export const formatINR = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Convert to fixed 2 decimals
  const fixed = absNum.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  // Format integer part using Indian digit grouping (last 3 digits, then pairs of 2)
  let formattedInt = '';
  if (intPart.length <= 3) {
    formattedInt = intPart;
  } else {
    const lastThree = intPart.substring(intPart.length - 3);
    const remaining = intPart.substring(0, intPart.length - 3);
    // Group remaining digits in pairs of 2 from right to left
    const pairs = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formattedInt = `${pairs},${lastThree}`;
  }

  const formattedNum = `${formattedInt}.${decPart}`;

  if (options.showExplicitPlus && num > 0) {
    return `+₹${formattedNum}`;
  }
  if (isNegative) {
    return `-₹${formattedNum}`;
  }
  return `₹${formattedNum}`;
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  return `${hours}:${minutes} - ${month} ${day}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getTimeOfDayGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = Date.now();
  const diffSec = Math.floor((now - Number(timestamp)) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};
