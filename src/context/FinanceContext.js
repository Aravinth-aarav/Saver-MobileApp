/**
 * FinanceContext.js
 * Manages financial transactions, categories, budgets, savings goals,
 * dynamic report aggregations (Daily, Weekly, Monthly), and personalized Rupee (₹) alerts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_GOAL,
} from '../constants/dummyData';
import { useAuth } from './AuthContext';
import { formatINR } from '../utils/formatters';

const TX_STORAGE_KEY = '@saver_transactions_v2';
const CAT_STORAGE_KEY = '@saver_categories_v2';
const GOAL_STORAGE_KEY = '@saver_savings_goal_v2';
const BUDGET_STORAGE_KEY = '@saver_monthly_budget_v2';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [savingsGoal, setSavingsGoal] = useState(INITIAL_SAVINGS_GOAL);
  const [monthlyBudget, setMonthlyBudget] = useState(35000.00);
  const [isLoading, setIsLoading] = useState(true);

  // Personalized Alert modal state
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    const loadFinanceData = async () => {
      try {
        const storedTx = await AsyncStorage.getItem(TX_STORAGE_KEY);
        const storedCat = await AsyncStorage.getItem(CAT_STORAGE_KEY);
        const storedGoal = await AsyncStorage.getItem(GOAL_STORAGE_KEY);
        const storedBudget = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);

        if (storedTx) {
          setTransactions(JSON.parse(storedTx));
        } else {
          setTransactions(INITIAL_TRANSACTIONS);
          await AsyncStorage.setItem(TX_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
        }

        if (storedCat) {
          setCategories(JSON.parse(storedCat));
        } else {
          setCategories(INITIAL_CATEGORIES);
          await AsyncStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
        }

        if (storedGoal) {
          setSavingsGoal(JSON.parse(storedGoal));
        } else {
          setSavingsGoal(INITIAL_SAVINGS_GOAL);
          await AsyncStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(INITIAL_SAVINGS_GOAL));
        }

        if (storedBudget) {
          setMonthlyBudget(Number(storedBudget));
        } else if (currentUser?.monthlyBudget) {
          setMonthlyBudget(Number(currentUser.monthlyBudget));
        }
      } catch (error) {
        console.error('Failed to load finance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinanceData();
  }, [currentUser]);

  const saveTransactions = async (newTxList) => {
    setTransactions(newTxList);
    try {
      await AsyncStorage.setItem(TX_STORAGE_KEY, JSON.stringify(newTxList));
    } catch (e) {
      console.error('Failed to persist transactions:', e);
    }
  };

  /**
   * Calculate monthly financial totals
   */
  const getMonthlyTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += Math.abs(Number(tx.amount) || 0);
      } else {
        totalExpense += Math.abs(Number(tx.amount) || 0);
      }
    });

    const balance = totalIncome - totalExpense;
    const remainingBudget = Math.max(0, monthlyBudget - totalExpense);
    const budgetUsagePercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      remainingBudget,
      budgetUsagePercent,
      monthlyBudget,
    };
  };

  /**
   * Add a new transaction with personalized Rupee (₹) feedback & budget threshold warnings
   */
  const addTransaction = async (txData) => {
    const amountVal = Math.abs(Number(txData.amount) || 0);
    const finalAmount = txData.type === 'expense' ? -amountVal : amountVal;

    const newTx = {
      id: `tx-${Date.now()}`,
      title: txData.title.trim(),
      amount: finalAmount,
      type: txData.type,
      category: txData.category,
      categoryGroup: txData.categoryGroup || txData.category,
      date: txData.date || new Date().toISOString(),
      time: txData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: txData.icon || (txData.type === 'income' ? 'wallet-outline' : 'cart-outline'),
      tileColor: txData.tileColor || '#3299FF',
      notes: txData.notes || '',
    };

    const updated = [newTx, ...transactions];
    await saveTransactions(updated);

    const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';
    
    // Calculate new total expenses for this category
    const catGroup = newTx.categoryGroup || newTx.category;
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === catGroup.toLowerCase() || c.displayName.toLowerCase() === catGroup.toLowerCase()
    );

    let catTotalExpense = 0;
    updated.forEach((t) => {
      if (t.type === 'expense' && (t.categoryGroup === catGroup || t.category === catGroup)) {
        catTotalExpense += Math.abs(t.amount);
      }
    });

    let totalExpenseMonthly = 0;
    updated.forEach((t) => {
      if (t.type === 'expense') totalExpenseMonthly += Math.abs(t.amount);
    });
    const budgetLeft = Math.max(0, monthlyBudget - totalExpenseMonthly);

    let alertTitle = 'Transaction Added! 💰';
    let alertMessage = `Hey ${userName}, your ${txData.category} ${txData.type} of ${formatINR(amountVal)} was added. You have ${formatINR(budgetLeft)} left this month.`;
    let alertType = 'success';

    if (matchedCategory && matchedCategory.budget > 0 && txData.type === 'expense') {
      const catUsagePercent = (catTotalExpense / matchedCategory.budget) * 100;
      if (catUsagePercent >= 100) {
        alertTitle = '⚠️ Category Budget Exceeded!';
        alertMessage = `Hey ${userName}, your ${matchedCategory.displayName} expense pushed spending to ${formatINR(catTotalExpense)}, which exceeds your ${formatINR(matchedCategory.budget)} limit!`;
        alertType = 'danger';
      } else if (catUsagePercent >= 80) {
        alertTitle = '⚠️ Category Budget Warning';
        alertMessage = `Hey ${userName}, you've used ${catUsagePercent.toFixed(0)}% of your ${matchedCategory.displayName} budget (${formatINR(catTotalExpense)} / ${formatINR(matchedCategory.budget)}). Be careful!`;
        alertType = 'warning';
      }
    }

    setActiveAlert({
      title: alertTitle,
      message: alertMessage,
      type: alertType,
    });

    return newTx;
  };

  /**
   * Update an existing transaction
   */
  const updateTransaction = async (updatedTx) => {
    const amountVal = Math.abs(Number(updatedTx.amount) || 0);
    const finalAmount = updatedTx.type === 'expense' ? -amountVal : amountVal;

    const newTxList = transactions.map((t) =>
      t.id === updatedTx.id ? { ...updatedTx, amount: finalAmount } : t
    );
    await saveTransactions(newTxList);

    const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';
    setActiveAlert({
      title: 'Transaction Updated ✏️',
      message: `Hey ${userName}, your transaction "${updatedTx.title}" of ${formatINR(amountVal)} has been updated.`,
      type: 'success',
    });
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (id) => {
    const target = transactions.find((t) => t.id === id);
    const newTxList = transactions.filter((t) => t.id !== id);
    await saveTransactions(newTxList);

    const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';
    const amountStr = target ? ` (${formatINR(Math.abs(target.amount))})` : '';
    setActiveAlert({
      title: 'Transaction Deleted 🗑️',
      message: `Hey ${userName}, the transaction${amountStr} was removed from your records.`,
      type: 'warning',
    });
  };

  const updateMonthlyBudget = async (newBudget) => {
    const val = Number(newBudget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      await AsyncStorage.setItem(BUDGET_STORAGE_KEY, String(val));
    }
  };

  const updateCategoryBudget = async (categoryId, newBudget) => {
    const val = Number(newBudget);
    const updatedCats = categories.map((c) =>
      c.id === categoryId ? { ...c, budget: val } : c
    );
    setCategories(updatedCats);
    await AsyncStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(updatedCats));
  };

  /**
   * Report Data calculation based on Segmented Toggle: 'Daily' | 'Weekly' | 'Monthly'
   */
  const getReportData = (timeframe = 'Weekly') => {
    const now = new Date();
    let filtered = [];

    if (timeframe === 'Daily') {
      const todayStr = now.toDateString();
      filtered = transactions.filter((t) => new Date(t.date).toDateString() === todayStr);
    } else if (timeframe === 'Weekly') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = transactions.filter((t) => new Date(t.date) >= sevenDaysAgo);
    } else {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    }

    let income = 0;
    let expense = 0;

    filtered.forEach((tx) => {
      if (tx.type === 'income') {
        income += Math.abs(Number(tx.amount) || 0);
      } else {
        expense += Math.abs(Number(tx.amount) || 0);
      }
    });

    return {
      timeframe,
      transactions: filtered,
      income,
      expense,
      balance: income - expense,
    };
  };

  const dismissAlert = () => setActiveAlert(null);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        savingsGoal,
        monthlyBudget,
        isLoading,
        activeAlert,
        dismissAlert,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateMonthlyBudget,
        updateCategoryBudget,
        getMonthlyTotals,
        getReportData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
