# 🌿 Finance Budget Tracker

> **College Hackathon Exam Project**  
> A complete, production-grade mobile finance application built using **Expo (React Native, JavaScript)** with an elegant fintech aesthetic, offline local persistence, role-based access control, interactive SVG visualizations, and smart proactive alerts.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Design Style & Fintech Theme](#-design-style--fintech-theme)
3. [Key Features](#-key-features)
4. [Screens List](#-screens-list)
5. [User Roles & Demo Logins](#-user-roles--demo-logins)
6. [Tech Stack](#-tech-stack)
7. [Folder Structure](#-folder-structure)
8. [Installation & Setup](#-installation--setup)
9. [How to Run the App](#-how-to-run-the-app)
10. [Step-by-Step Build Order (Exam Grading Flow)](#-step-by-step-build-order-exam-grading-flow)
11. [GitHub Push Commands](#-github-push-commands)
12. [Exam Requirements Verification Checklist](#-exam-requirements-verification-checklist)

---

## 🌟 Project Overview

**Finance Budget Tracker** is a mobile application designed for students and working professionals to monitor their income, expenses, and savings goals in real time. It features:
- **100% Local & Offline**: Built using React Context API + `@react-native-async-storage/async-storage` with zero external backend dependencies.
- **Tri-Navigation Architecture**: Combines Native Stack, Custom Floating Bottom Tabs, and an edge-swipe Drawer.
- **Proactive Intelligence**: Generates personalized transaction feedback and alerts users when category budgets reach 80% or exceed 100%.

---

## 🎨 Design Style & Fintech Theme

- **Primary Green**: `#00D09E` — Signature fresh fintech accent.
- **Mint Background Sheet**: `#F1FFF3` — Overlapping card sheet on every screen with `~48px` rounded top corners.
- **Light Green Bar**: `#DFF7E2` — Container for floating bottom tabs and segmented toggles.
- **Dark Text**: `#052224` — High-contrast, clean typography.
- **Blue Amounts**: `#0068FF` — Used for expenses and transaction amounts.
- **Icon Tile Blues**: `#6DB6FE` (light), `#3299FF` (medium), `#0068FF` (dark).
- **Big Rounded Corners**: Cards `~25px`, bottom sheet `~50px`, pill-shaped buttons & toggles (`borderRadius: 999`).
- **Typography**: Google Poppins (`@expo-google-fonts/poppins`) with graceful font fallback.

---

## ✨ Key Features

1. **Home Screen (Reference Layout Match)**:
   - **Green Top Header**: "Hi, Welcome Back" (bold dark text) with dynamic time-of-day greeting (*"Good Morning / Afternoon / Evening"*), hamburger drawer menu button, and notification bell inside a light circle.
   - **Dual Stats Banner**: "Total Balance" (white, bold) and "Total Expense" (blue, negative number) separated by an elegant vertical divider.
   - **Dynamic Budget Progress Bar**: Dark filled portion showing the % on the left, white remaining portion displaying the budget goal amount (`$20,000.00`) on the right. Below it, dynamic status evaluation:
     - Under `50%`: *"Looks Good."*
     - `50% - 80%`: *"Be Careful."*
     - Above `80%`: *"Budget Almost Over!"*
   - **Mint Rounded Bottom Sheet**:
     - **Green Savings Card**: Left side features a circular SVG progress ring with a car icon and *"Savings On Goals"*; vertical divider; right side displays *"Revenue Last Week"* (money icon) and *"Food Last Week"* (fork-knife icon, blue amount).
     - **Segmented Toggle**: `Daily` | `Weekly` | `Monthly` pill toggle in `#DFF7E2` container with `#00D09E` active pill; updates totals and transactions list dynamically.
     - **Detailed Transaction Rows**: Rounded-square blue icon tile, bold title, small blue bold time and date (`18:27 - April 30`), dividers, category, and amounts (income dark, expenses blue with minus).
2. **Visual Analytics**:
   - Expense distribution donut/pie chart using `react-native-chart-kit`.
   - Monthly Income vs Expense comparison bar chart.
   - Category spending breakdown with mini progress indicators.
3. **Month-Wise Transactions Management**:
   - Month selector (Previous Month, Current Month, Next Month).
   - Monthly summary banner (Income, Expenses, Net Remaining).
   - Grouped by date (e.g., *"Today"*, *"Yesterday"*, etc.).
   - Full Add / Edit / Delete modal with confirmation.
4. **Budget Categories & Details**:
   - Grid of 6 categories: Food, Transport, Shopping, Bills, Health, Entertainment.
   - Visual progress bars (<80% green, 80-99% orange, >=100% red).
   - Category Details screen with consumption gauge chart and category-filtered transaction history.
5. **Smart Personalized Alerts**:
   - Triggered on every Add / Edit / Delete mutation: e.g., *"Hey Priya, your Food expense of $50 was added. You have $2,500 left this month."*
   - Automatic warnings when category budgets cross `80%` or `100%`.
6. **Form Validation**:
   - Prominent red inline error text below invalid fields.
   - Strict validation: valid email regex, 10-digit phone, password min 6 chars with letters & numbers, numeric amounts > 0.

---

## 📱 Screens List

| # | Screen Name | Role Access | Description |
|---|---|---|---|
| 1 | **Welcome** | Public | Brand logo, feature pills, demo credentials hint, Sign In & Sign Up triggers |
| 2 | **Sign In** | Public | Role selector (Customer/Admin), 1-tap demo auto-fill buttons, inline red errors |
| 3 | **Sign Up** | Public | Full Name, Email, 10-digit Phone, Password, Confirm Password with inline validation |
| 4 | **Home** | Admin & Customer | Top stats, budget progress bar, savings card, segmented toggle, transaction list |
| 5 | **Analysis** | Admin & Customer | Category Donut Chart, Income vs Expense Bar Chart, KPI cards, Admin mode banner |
| 6 | **Transactions** | Customer | Month selector, date grouping, Add / Edit / Delete modal, personalized alert trigger |
| 7 | **Categories** | Customer | Grid of 6 categories with progress bars (<80% green, 80-99% orange, >=100% red) |
| 8 | **Category Details** | Customer | Spent vs budget left, ProgressChart gauge, filtered transactions list |
| 9 | **Profile** | Customer | User avatar, role badge, phone, monthly budget card, quick stats |
| 10 | **Edit Profile** | Customer | Form to update name, email, phone, and monthly budget limit with validation |
| 11 | **About** | All (via Drawer) | Hackathon project overview, tech badges, and exam requirements checklist |

---

## 👥 User Roles & Demo Logins

The application enforces Role-Based Access Control (RBAC):
- **Customer**: Access to all 5 bottom tabs (`Home`, `Analysis`, `Transactions`, `Categories`, `Profile`) and Drawer items.
- **Admin**: Simplified supervision view — bottom tab bar displays only 2 tabs (`Home` and `Analysis`), and Drawer items are restricted.

### 🔑 Demo Credentials (1-Tap Auto-fill available on Sign In screen):

```text
Customer Account:
Email:    customer@demo.com
Password: Customer@123
Role:     Customer

Admin Account:
Email:    admin@demo.com
Password: Admin@123
Role:     Admin
```

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.74.5) via [Expo SDK 51](https://expo.dev/)
- **Navigation**: [React Navigation 6](https://reactnavigation.org/)
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/drawer`
- **State & Storage**: React Context API (`AuthContext`, `FinanceContext`) + `@react-native-async-storage/async-storage`
- **Charts & Graphics**: `react-native-chart-kit` and `react-native-svg`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Typography**: `@expo-google-fonts/poppins` via `expo-font`

---

## 📁 Folder Structure

```
finance-budget-tracker/
├── assets/                  # Icons, splash screens, favicon
├── src/
│   ├── components/          # Header, Card, Button, InputField, SegmentedToggle, ProgressBar, CircularProgress, TransactionItem, CategoryCard, PersonalizedAlertModal
│   ├── constants/           # theme.js, dummyData.js
│   ├── context/             # AuthContext.js, FinanceContext.js
│   ├── navigation/          # RootNavigator.js, DrawerNavigator.js, BottomTabNavigator.js
│   ├── screens/             # 11 complete application screens
│   └── utils/               # formatters.js, validators.js
├── App.js                   # Application root with font loader & safe areas
├── app.json                 # Expo project manifest
├── babel.config.js          # Babel preset and reanimated plugin
├── package.json             # Dependencies and scripts
└── .gitignore               # Ignored files (node_modules, .expo, etc.)
```

---

## ⚙️ Installation & Setup

1. **Clone or open the repository**:
   ```bash
   cd "React Native Sem"
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

---

## 🚀 How to Run the App

Start the Expo development server:
```bash
npx expo start
```

### Testing Options:
- **Expo Go (Physical Device)**: Scan the QR code shown in your terminal using the Expo Go mobile app (Android) or Camera app (iOS).
- **Android Emulator**: Press `a` in the terminal while your emulator is active.
- **iOS Simulator**: Press `i` in the terminal (macOS).
- **Web Browser**: Press `w` in the terminal.

---

## 🏗️ Step-by-Step Build Order (Exam Grading Flow)

This project was built incrementally across 4 high-mark stages:

### Stage 1: Setup + Theme + Tri-Navigation Skeleton
- Configured Expo SDK 51, `@react-native-async-storage/async-storage`, and Google Poppins fonts.
- Built [`src/constants/theme.js`](src/constants/theme.js) with `#00D09E`, `#F1FFF3`, `#DFF7E2`, and 25px/50px rounded radii.
- Established the Tri-Navigation hierarchy: Native Stack (`RootNavigator`), custom floating rounded bottom tabs (`BottomTabNavigator`), and left-edge swipe drawer (`DrawerNavigator`).

### Stage 2: Welcome, Authentication, & Home Screen Layout
- Implemented `WelcomeScreen`, `SignInScreen`, and `SignUpScreen` with role switching (Customer vs Admin) and 1-tap demo credentials autofill.
- Created `HomeScreen` strictly matching the reference layout:
  - Top green header with time-of-day greeting, drawer hamburger, notification bell circle.
  - Side-by-side Total Balance & Total Expense stats with vertical divider.
  - Budget progress bar with dark % part, white goal part, and dynamic status message.
  - Mint rounded bottom sheet with green savings card (SVG circular ring + car icon), `Daily | Weekly | Monthly` segmented toggle, and detailed transaction rows.

### Stage 3: Analysis, Transactions, Categories, & Profile
- Built `AnalysisScreen` with category donut chart and income vs expense bar chart using `react-native-chart-kit`.
- Built `TransactionsScreen` with month navigation, date-grouped list, monthly totals, and Add / Edit / Delete modal.
- Built `CategoriesScreen` and `CategoryDetailsScreen` with 6 categories, budget gauges, and category-filtered transaction history.
- Built `ProfileScreen` and `EditProfileScreen` with user details and editable monthly budget limit.

### Stage 4: Proactive Alerts, Dynamic Reports, & Validation
- Connected `PersonalizedAlertModal` in `FinanceContext` to trigger on every transaction add/edit/delete.
- Implemented automatic warnings when any category budget crosses `80%` or `100%`.
- Hooked dynamic Daily / Weekly / Monthly report calculation to update totals and transaction lists in real time.
- Integrated strict red inline error messages on every form input.

---

## 📤 GitHub Push Commands

To publish this project to a new public GitHub repository, run the following commands in PowerShell or Terminal inside this directory:

```bash
# 1. Initialize git in the project root
git init

# 2. Stage all project files (node_modules is excluded by .gitignore)
git add .

# 3. Create the initial commit
git commit -m "feat: complete Finance Budget Tracker app for hackathon exam"

# 4. Rename default branch to main
git branch -M main

# 5. Add your GitHub repository remote (replace <YOUR_USERNAME> and <REPO_NAME>)
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ✅ Exam Requirements Verification Checklist

| # | Requirement | Implementation Verification | Status |
|---|---|---|:---:|
| 1 | **Design Style** | Fresh green fintech look (`#00D09E`, `#F1FFF3`, `#DFF7E2`), Poppins font, 25px card corners, 50px rounded mint sheet. | ✅ Verified |
| 2 | **Header Overlap** | All screens feature the green header on top with the mint rounded sheet overlapping from below. | ✅ Verified |
| 3 | **Home Screen Layout** | Greeting changes by time of day, notification bell circle, Total Balance & Total Expense with divider, dynamic budget progress bar. | ✅ Verified |
| 4 | **Savings Card & SVG Ring** | Green card with SVG circular ring (`react-native-svg`), car icon, "Savings On Goals", "Revenue Last Week", "Food Last Week". | ✅ Verified |
| 5 | **Segmented Toggle** | `Daily` \| `Weekly` \| `Monthly` toggle in `#DFF7E2` container with `#00D09E` pill; updates report totals & list. | ✅ Verified |
| 6 | **Transaction Item Format** | Rounded-square blue icon tile, bold title, blue time & date (`18:27 - April 30`), dividers, category, and amounts. | ✅ Verified |
| 7 | **Bottom Tab Bar** | Rounded light-green container, active tab gets green rounded-square background. Customer has 5 tabs; Admin has 2 tabs. | ✅ Verified |
| 8 | **Dual User Roles** | Customer & Admin role selector on Sign In / Sign Up. Demo logins: `admin@demo.com` and `customer@demo.com`. | ✅ Verified |
| 9 | **Tri-Navigation** | Native Stack + Custom Bottom Tabs + Left Edge Swipe Drawer with Home, Profile, About, Logout. | ✅ Verified |
| 10 | **Analysis Screen** | Category Donut Chart, Income vs Expense Bar Chart, KPI cards, Admin mode banner. | ✅ Verified |
| 11 | **Transactions Screen** | Month selector, date-grouped list, monthly totals banner, Add / Edit / Delete modal with confirmation. | ✅ Verified |
| 12 | **Categories & Details** | Grid of 6 categories with progress bars (<80% green, 80-99% orange, >=100% red) and Category Details screen. | ✅ Verified |
| 13 | **Personalized Alerts** | Alert popup on add/edit/delete: *"Hey Priya, your Food expense of $50 was added..."* + 80% & 100% budget breach alerts. | ✅ Verified |
| 14 | **Form Validation** | Inline red error text under each field: valid email regex, 10-digit phone, password min 6 chars, amount > 0. | ✅ Verified |
| 15 | **Offline Persistence** | Context API (`AuthContext`, `FinanceContext`) + `AsyncStorage` with realistic dummy data. Zero backend required. | ✅ Verified |
| 16 | **GitHub Ready** | `.gitignore`, comprehensive `README.md`, and clean Git push workflow provided. | ✅ Verified |

---

**Developed for College Hackathon Exam — Advanced React Native & Mobile Systems.**
