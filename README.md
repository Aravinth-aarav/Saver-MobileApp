# 🌿 Saver — Personal Finance & Budget Tracker

> **College Hackathon Exam Project**  
> A complete, production-grade mobile finance application built using **Expo (React Native, JavaScript)**. Built around Indian Rupee (**₹**) currency, role-based access control, local offline persistence, SVG visualizations, and smart proactive threshold warnings.

---

## 📌 Table of Contents
1. [App Identity](#-app-identity)
2. [Design Style & Fintech Theme](#-design-style--fintech-theme)
3. [App Flow & Architecture](#-app-flow--architecture)
4. [Screens List](#-screens-list)
5. [User Roles & Demo Logins](#-user-roles--demo-logins)
6. [Tech Stack](#-tech-stack)
7. [Folder Structure](#-folder-structure)
8. [Installation & Setup](#-installation--setup)
9. [How to Run the App](#-how-to-run-the-app)
10. [GitHub Push Commands](#-github-push-commands)
11. [Exam Feature Mapping & Scoring Breakdown](#-exam-feature-mapping--scoring-breakdown)
12. [📸 Screenshot Checklist for Word Document](#-screenshot-checklist-for-word-document)

---

## 💎 App Identity

- **App Name**: **Saver**
- **Logo**: Rupee symbol (**₹**) inside a rounded green badge/circle, paired with bold Poppins "Saver" brand text. Implemented entirely in code as a reusable `<Logo />` component (`src/components/Logo.js`) with zero image file dependencies.
- **Currency**: **Indian Rupee (₹) everywhere**. Powered by a custom `formatINR()` helper function with Indian digit grouping (e.g. `₹1,25,000.00`, `₹77,830.00`, `-₹1,000.00`). Does not rely on `Intl` for guaranteed cross-platform compatibility across Hermes, Android, and iOS.
- **Realistic Seed Data**:
  - Salary: `₹40,000.00`
  - Groceries & Pantry: `-₹1,000.00`
  - House Rent: `-₹6,740.00`
  - Total Balance: `₹77,830.00`
  - Savings Goal: `₹2,00,000.00` (Electric Car / Vehicle Fund)
  - Revenue Last Week: `₹42,000.00`
  - Food Last Week: `-₹1,800.00`

---

## 🎨 Design Style & Fintech Theme

- **Primary Green**: `#00D09E` — Signature fresh fintech accent.
- **Mint Background**: `#F1FFF3` — Overlapping sheet on every inner screen with `~48px` rounded top corners.
- **Light Green**: `#DFF7E2` — Container for floating bottom tabs and segmented toggles.
- **Dark Text**: `#052224` — High-contrast typography.
- **Blue Amounts**: `#0068FF` — Used for expenses and transaction amounts.
- **Icon Tile Blues**: `#6DB6FE` (light), `#3299FF` (medium), `#0068FF` (dark).
- **Big Rounded Corners**: Cards `~25px`, bottom sheet `~50px`, pill-shaped buttons & toggles (`borderRadius: 999`).
- **Typography**: Google Poppins (`@expo-google-fonts/poppins`) with graceful font fallback.

---

## 🔄 App Flow & Architecture

1. **Initial Boot (Scan QR Code)**:
   - Opens **directly on the Home landing screen**.
   - **No auto-login**.
   - Screen displays ONLY: Saver logo + name, tagline (*"Save smart. Spend wise."*), and two buttons: **"Login"** and **"Sign Up"**. No forms, no clutter.
2. **Authentication Screens**:
   - `Login` and `Sign Up` are separate screens opened from Home.
   - Both feature a role selector (**Customer** vs **Admin**) and 1-tap demo logins.
3. **Dashboard Transition**:
   - On successful Login or Sign Up, the stack transitions directly to the **Dashboard** inside the Drawer/Tab hierarchy (replacing auth screens so the Back button never returns to login).
4. **Logout**:
   - Logging out from the Drawer resets authentication state and navigates straight back to the **Home landing screen**.

---

## 📱 Screens List

| # | Screen Name | Role Access | Description |
|---|---|---|---|
| 1 | **Home (Landing)** | Public | Minimalist landing with Logo, app name, tagline, and Login & Sign Up buttons |
| 2 | **Login** | Public | Role selector (Customer/Admin), 1-tap demo auto-fill buttons, inline red errors |
| 3 | **Sign Up** | Public | Full Name, Email, 10-digit Phone, Password, Confirm Password with inline validation |
| 4 | **Dashboard** | Admin & Customer | Top stats, budget progress bar, savings card, segmented toggle, transaction list |
| 5 | **Analysis** | Admin & Customer | Category Donut Chart, Income vs Expense Bar Chart, KPI cards, Admin overview banner |
| 6 | **Transactions** | Customer | Month selector, date grouping, Add / Edit / Delete modal in ₹, personalized alert trigger |
| 7 | **Categories** | Customer | Grid of 6 categories with progress bars (<80% green, 80-99% orange, >=100% red) |
| 8 | **Category Details** | Customer | Spent vs budget left in ₹, ProgressChart gauge, filtered transactions list |
| 9 | **Profile** | Customer | User avatar, role badge, phone, monthly budget card in ₹, quick stats |
| 10 | **Edit Profile** | Customer | Form to update name, email, phone, and monthly budget limit with validation |
| 11 | **About Saver** | All (via Drawer) | Hackathon project overview, tech badges, and exam requirements checklist |

---

## 👥 User Roles & Demo Logins

The application enforces Role-Based Access Control (RBAC):
- **Customer**: Access to all 5 bottom tabs (`Dashboard`, `Analysis`, `Transactions`, `Categories`, `Profile`) and Drawer items.
- **Admin**: Simplified supervision view — bottom tab bar displays only 2 tabs (`Dashboard` and `Analysis`) with overall metrics across all customers from dummy data.

### 🔑 Demo Credentials (1-Tap Auto-fill available on Login screen):

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
  - `@react-navigation/native-stack` (Root stack)
  - `@react-navigation/bottom-tabs` (Custom styled bottom bar)
  - `@react-navigation/drawer` (Left edge-swipe drawer)
- **State & Storage**: React Context API (`AuthContext`, `FinanceContext`) + `@react-native-async-storage/async-storage`
- **Charts & Graphics**: `react-native-chart-kit` and `react-native-svg`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Typography**: `@expo-google-fonts/poppins` via `expo-font`

---

## 📁 Folder Structure

```
saver/
├── assets/                  # Icons, splash screens, favicon
├── src/
│   ├── components/
│   │   ├── Button.js                # Pill-shaped fintech buttons (primary, secondary, outline, danger)
│   │   ├── Card.js                  # 25px rounded corner card container with elevation
│   │   ├── CategoryCard.js          # Grid item with icon tile, spent vs budget in ₹, and colored bar
│   │   ├── CircularProgress.js      # SVG circular progress ring with centered car icon
│   │   ├── Header.js                # Green curved header with greeting, bell circle, and balance in ₹
│   │   ├── InputField.js            # Input with left icon and red inline validation text
│   │   ├── Logo.js                  # Code-based Saver brand logo with ₹ badge & bold typography
│   │   ├── PersonalizedAlertModal.js# Smart feedback modal on mutations & 80%/100% budget alerts
│   │   ├── ProgressBar.js           # Dark % part + white remaining goal bar & dynamic status messages
│   │   ├── SegmentedToggle.js       # Daily | Weekly | Monthly light-green container with active pill
│   │   └── TransactionItem.js       # Blue icon tile, title, blue time/date, category, amount in ₹
│   ├── constants/
│   │   ├── dummyData.js             # Seeded realistic rupee data (Salary ₹40,000, Rent ₹6,740, balance ₹77,830)
│   │   └── theme.js                 # Colors (#00D09E, #F1FFF3, #DFF7E2), typography, ~25px/~50px radii
│   ├── context/
│   │   ├── AuthContext.js           # Session, role management, login, signup, logout
│   │   └── FinanceContext.js        # Transactions CRUD, categories, budgets in ₹, reports, personalized alerts
│   ├── navigation/
│   │   ├── BottomTabNavigator.js    # Rounded bottom bar (Customer: 5 tabs, Admin: 2 tabs)
│   │   ├── DrawerNavigator.js       # Drawer wrapping tabs (Dashboard, Profile, About Saver, Logout)
│   │   └── RootNavigator.js         # Master Native Stack (Home -> Login -> SignUp -> App)
│   ├── screens/
│   │   ├── AboutScreen.js           # Project details, tech badges, and exam verification
│   │   ├── AnalysisScreen.js        # Donut chart, income vs expense bar chart, summary in ₹, admin mode
│   │   ├── CategoriesScreen.js      # Grid of 6 categories in ₹ with progress bars
│   │   ├── CategoryDetailsScreen.js # Spent vs budget left in ₹, consumption gauge, transactions list
│   │   ├── DashboardScreen.js       # Main dashboard layout: stats, progress bar, savings card, toggle, list
│   │   ├── EditProfileScreen.js     # Form to update profile & budget in ₹ with inline validation
│   │   ├── HomeScreen.js            # Landing screen: Logo, name, tagline, Login and Sign Up buttons ONLY
│   │   ├── LoginScreen.js           # Role selector, email, password, 1-tap demo logins, inline red errors
│   │   ├── ProfileScreen.js         # User avatar, role badge, phone, monthly budget card in ₹
│   │   ├── SignUpScreen.js          # Role selector, name, email, phone, password, confirm pass, inline errors
│   │   └── TransactionsScreen.js    # Month selector, date groups, add/edit/delete modal in ₹, alert trigger
│   └── utils/
│       ├── formatters.js            # formatINR() pure JS Indian digit grouping, date/time, greetings
│       └── validators.js            # Email regex, password 6+ chars, 10-digit phone, numeric amount > 0
├── App.js                   # Application root with Poppins font loader & safe areas
├── app.json                 # Expo project manifest ("name": "Saver")
├── babel.config.js          # Babel preset and react-native-reanimated plugin
├── package.json             # Dependencies and scripts
└── .gitignore               # Ignored files (node_modules, .expo, etc.)
```

---

## ⚙️ Installation & Setup

1. **Open project root**:
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
# Recommended: Tunnel mode (works on mobile data and college Wi-Fi)
npx expo start --tunnel -c

# Local network mode
npx expo start
```

### Testing on Your Phone:
- **Android**: Open **Expo Go** → tap **"Scan QR code"** inside the app.
- **iOS**: Open default **Camera app** → tap the yellow **"Open in Expo Go"** banner.

---

## 📤 GitHub Push Commands

To publish this project to a new public GitHub repository:

```bash
# 1. Verify git status
git status

# 2. Add your remote repository URL (replace <YOUR_USERNAME> and <REPO_NAME>)
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# 3. Push to main branch
git push -u origin main
```

---

## 🎯 Exam Feature Mapping & Scoring Breakdown

| Marks Category | Feature Description | Implementation Details | Status |
|---|---|---|:---:|
| **30 Marks** | **Tri-Navigation Architecture** | Native Stack (`RootNavigator`), Custom Floating Bottom Tabs (`BottomTabNavigator`), Left Edge Swipe Drawer (`DrawerNavigator`). | ✅ 100% Complete |
| **15 Marks** | **Functional Requirements** | Personalized alerts on add/edit/delete in ₹, 80%/100% budget alerts, Daily/Weekly/Monthly reports, live data sync across all screens. | ✅ 100% Complete |
| **UI & Identity** | **Saver App & Rupee (₹) System** | Custom `<Logo />` in code, `formatINR()` pure JS Indian digit grouping without Intl, realistic amounts (Salary ₹40,000, Rent ₹6,740, balance ₹77,830). | ✅ 100% Complete |
| **Flow** | **Landing Screen & Auth Flow** | Home landing screen shows ONLY Logo + tagline + Login & Sign Up buttons (no auto-login). Successful auth transitions directly to Dashboard. | ✅ 100% Complete |
| **Roles** | **Role-Based Access Control** | Customer sees all 5 tabs; Admin sees only Dashboard and Analysis tabs. Demo logins with 1-tap fill. | ✅ 100% Complete |
| **Validation** | **Inline Red Error Messages** | Strict regex email, 10-digit phone, password min 6 chars, amount > 0, displayed directly below inputs. | ✅ 100% Complete |

---

## 📸 Screenshot Checklist for Word Document

Use this checklist to capture every screenshot required for your hackathon exam submission report:

- [ ] **Screenshot 1: Home (Landing Screen)** — Showing the Saver logo (rupee symbol ₹ in green badge), "Saver" brand text, tagline *"Save smart. Spend wise."*, and Login / Sign Up buttons.
- [ ] **Screenshot 2: Login Screen (Customer)** — Role selector set to Customer with 1-tap demo chips and input fields.
- [ ] **Screenshot 3: Login Screen (Admin)** — Role selector set to Admin.
- [ ] **Screenshot 4: Sign Up Screen with Inline Validation Errors** — Showing red inline error text under invalid fields (e.g. invalid email, phone not 10 digits, password mismatch).
- [ ] **Screenshot 5: Dashboard Screen (Customer)** — Top green header with greeting (*"Good Morning, Priya"*), Total Balance (`₹77,830.00`), Total Expense (`-₹17,170.00`), budget progress bar, savings card (car icon + SVG ring), Daily/Weekly/Monthly toggle, and transaction rows.
- [ ] **Screenshot 6: Navigation Drawer Open** — Swiped from left showing user header (Priya Sharma, Customer), Dashboard, Profile & Settings, About Saver, and Logout links.
- [ ] **Screenshot 7: Analysis Screen** — Showing Category Donut Chart, Monthly Income vs Expense Bar Chart, and summary KPI cards in ₹.
- [ ] **Screenshot 8: Analysis Screen (Admin Mode)** — Logged in as Admin showing the blue "Admin View Active" banner and 2 tabs on bottom bar.
- [ ] **Screenshot 9: Transactions Screen** — Month selector (*May 2026*), date-grouped list, monthly totals banner, and "+ Add Transaction" floating button.
- [ ] **Screenshot 10: Add Transaction Modal** — Modal open showing Title, Amount (₹), Category picker chips, and Date input.
- [ ] **Screenshot 11: Personalized Alert Modal** — Showing feedback popup: *"Hey Priya, your Food expense of ₹500.00 was added. You have ₹25,000.00 left this month."*
- [ ] **Screenshot 12: Category Budget Warning Modal (80% / 100%)** — Showing proactive alert: *"⚠️ Category Budget Warning: You've used 85% of your Food budget!"*
- [ ] **Screenshot 13: Categories Screen** — Grid of 6 categories (Food, Transport, Shopping, Bills, Health, Entertainment) with progress bars.
- [ ] **Screenshot 14: Category Details Screen** — Detailed category view with Total Spent, Budget Left, consumption gauge chart, and category transactions list.
- [ ] **Screenshot 15: Profile & Edit Profile Screens** — Customer profile card, monthly budget limit card in ₹, and edit form with Save button.
- [ ] **Screenshot 16: About Saver Screen** — Exam verification checklist and tech stack badges.
- [ ] **Screenshot 17: Logout Action** — Demonstrating that tapping Logout resets authentication and brings the user back to the Home landing screen.
