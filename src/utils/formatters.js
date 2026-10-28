/**
 * formatters.js
 * Helpers for currency, dates, times, and dynamic time-of-day greetings
 */

export const formatCurrency = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = absNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (options.showExplicitPlus && num > 0) {
    return `+$${formatted}`;
  }
  if (isNegative) {
    return `-$${formatted}`;
  }
  return `$${formatted}`;
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
