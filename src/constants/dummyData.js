/**
 * dummyData.js
 * Initial seed data for Finance Budget Tracker
 * Context API + AsyncStorage will hydrate from this on first run
 */

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Food',
    displayName: 'Food & Dining',
    icon: 'restaurant',
    budget: 800,
    color: '#3299FF',
  },
  {
    id: 'cat-2',
    name: 'Transport',
    displayName: 'Transportation',
    icon: 'car',
    budget: 400,
    color: '#6DB6FE',
  },
  {
    id: 'cat-3',
    name: 'Shopping',
    displayName: 'Shopping',
    icon: 'cart',
    budget: 600,
    color: '#0068FF',
  },
  {
    id: 'cat-4',
    name: 'Bills',
    displayName: 'Bills & Utilities',
    icon: 'receipt',
    budget: 700,
    color: '#3299FF',
  },
  {
    id: 'cat-5',
    name: 'Health',
    displayName: 'Health & Medical',
    icon: 'medkit',
    budget: 450,
    color: '#6DB6FE',
  },
  {
    id: 'cat-6',
    name: 'Entertainment',
    displayName: 'Entertainment',
    icon: 'film',
    budget: 350,
    color: '#0068FF',
  },
];

const now = new Date();
const todayISO = now.toISOString();

// 2 days ago
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
// 4 days ago
const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
// 8 days ago
const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
// 12 days ago
const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Salary Deposit',
    amount: 5000.00,
    type: 'income',
    category: 'Monthly',
    categoryGroup: 'Bills',
    date: todayISO,
    time: '09:15',
    icon: 'wallet-outline',
    tileColor: '#0068FF',
    notes: 'Monthly corporate payroll direct deposit',
  },
  {
    id: 'tx-2',
    title: 'Grocery Pantry',
    amount: -142.50,
    type: 'expense',
    category: 'Pantry',
    categoryGroup: 'Food',
    date: todayISO,
    time: '18:27',
    icon: 'cart-outline',
    tileColor: '#3299FF',
    notes: 'Organic vegetables, milk, pantry staples',
  },
  {
    id: 'tx-3',
    title: 'Apartment Rent',
    amount: -1200.00,
    type: 'expense',
    category: 'Rent',
    categoryGroup: 'Bills',
    date: twoDaysAgo,
    time: '11:00',
    icon: 'home-outline',
    tileColor: '#6DB6FE',
    notes: 'May apartment rental payment',
  },
  {
    id: 'tx-4',
    title: 'Uber City Commute',
    amount: -28.50,
    type: 'expense',
    category: 'Transport',
    categoryGroup: 'Transport',
    date: twoDaysAgo,
    time: '08:45',
    icon: 'car-outline',
    tileColor: '#0068FF',
    notes: 'Morning ride to university campus',
  },
  {
    id: 'tx-5',
    title: 'Freelance Design Gig',
    amount: 850.00,
    type: 'income',
    category: 'Freelance',
    categoryGroup: 'Shopping',
    date: fourDaysAgo,
    time: '16:20',
    icon: 'laptop-outline',
    tileColor: '#3299FF',
    notes: 'Brand identity design project milestone 1',
  },
  {
    id: 'tx-6',
    title: 'Starbucks Coffee & Cafe',
    amount: -16.80,
    type: 'expense',
    category: 'Food',
    categoryGroup: 'Food',
    date: fourDaysAgo,
    time: '15:10',
    icon: 'cafe-outline',
    tileColor: '#6DB6FE',
    notes: 'Caramel macchiato with study group',
  },
  {
    id: 'tx-7',
    title: 'Electricity & High-speed Wifi',
    amount: -115.00,
    type: 'expense',
    category: 'Bills',
    categoryGroup: 'Bills',
    date: eightDaysAgo,
    time: '10:30',
    icon: 'flash-outline',
    tileColor: '#0068FF',
    notes: 'Utility bill payment',
  },
  {
    id: 'tx-8',
    title: 'Pharmacy & Health Vitamins',
    amount: -65.20,
    type: 'expense',
    category: 'Health',
    categoryGroup: 'Health',
    date: eightDaysAgo,
    time: '14:05',
    icon: 'medkit-outline',
    tileColor: '#3299FF',
    notes: 'Daily multivitamins & supplements',
  },
  {
    id: 'tx-9',
    title: 'Movie Night & Popcorn',
    amount: -45.00,
    type: 'expense',
    category: 'Entertainment',
    categoryGroup: 'Entertainment',
    date: twelveDaysAgo,
    time: '20:15',
    icon: 'film-outline',
    tileColor: '#6DB6FE',
    notes: 'IMAX weekend movie with friends',
  },
  {
    id: 'tx-10',
    title: 'Sneakers & Sportswear',
    amount: -130.00,
    type: 'expense',
    category: 'Shopping',
    categoryGroup: 'Shopping',
    date: twelveDaysAgo,
    time: '17:40',
    icon: 'shirt-outline',
    tileColor: '#0068FF',
    notes: 'Running shoes on seasonal clearance',
  },
];

export const INITIAL_SAVINGS_GOAL = {
  title: 'Savings On Goals',
  target: 'Electric Car Fund',
  goalAmount: 20000.00,
  savedAmount: 14200.00, // 71%
  percentage: 71,
  revenueLastWeek: 4200.00,
  foodLastWeek: -180.00,
};

export const DEMO_USERS = [
  {
    id: 'usr-admin',
    email: 'admin@demo.com',
    password: 'Admin@123',
    name: 'Admin Supervisor',
    phone: '9876543210',
    role: 'admin',
    monthlyBudget: 25000.00,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'usr-customer',
    email: 'customer@demo.com',
    password: 'Customer@123',
    name: 'Priya Sharma',
    phone: '9876543210',
    role: 'customer',
    monthlyBudget: 5000.00,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  },
];
