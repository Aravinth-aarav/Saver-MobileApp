/**
 * theme.js
 * Central theme definition for Finance Budget Tracker
 * Matches reference design: Fresh green fintech style, mint backgrounds, big rounded corners
 */

export const colors = {
  // Brand & Backgrounds
  primary: '#38BDF8',            // Fresh fintech green
  primaryDark: '#38BDF8',        // Darker green for press state
  background: '#F1FFF3',         // Mint background
  surface: '#FFFFFF',            // Card white
  lightGreen: '#DFF7E2',         // Light green for nav bar / toggle background
  lightGreenSoft: '#EBFBEF',     // Softer mint tint

  // Dark Blue Cards & Surfaces (Modern Navy Fintech)
  darkBlue: '#1e698dff',           // Deep royal dark blue
  darkBlueCard: '#055071ff',       // Sleek rich dark navy card
  darkBlueCardElevated: '#144c68ff', // Inner highlights on dark blue
  darkBlueCardBorder: '#144c68ff',
  cardTextWhite: '#FFFFFF',
  cardTextSilver: '#94A3B8',
  cardTextMuted: '#64748B',
  accentCyan: '#38BDF8',
  accentEmerald: '#00c08fff',

  // Typography
  darkText: '#052224',           // Primary dark text
  textMuted: '#5E7A7D',          // Secondary muted text
  textLight: '#8CA4A6',          // Inactive / subtle text
  white: '#fdfefe',

  // Accents & Amounts
  blueAmount: '#0068FF',         // Blue for expense amounts
  blueLight: '#E8F2FF',          // Blue background tint
  incomeGreen: '#00B386',        // Positive income color

  // Icon Tile Blues
  iconTileBlueLight: '#02ffff',
  iconTileBlueMedium: '#01f4f4ff',
  iconTileBlueDark: '#0068FF',

  // Status Colors
  danger: '#FF4D4D',             // Red for errors & budget alerts (>100%)
  dangerLight: '#FFEAEA',
  warning: '#FFA800',            // Orange for budget warning (50-80%)
  warningLight: '#FFF4E0',
  success: '#026a52ff',            // Green for under 50%

  // Borders & Dividers
  borderLight: '#DCEFE1',
  divider: 'rgba(5, 34, 36, 0.08)',
  dividerWhite: 'rgba(255, 255, 255, 0.35)',
};

export const typography = {
  // Font families (with fallback)
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const borderRadius = {
  sm: 10,
  md: 16,
  card: 25,                      // Cards ~25px
  sheet: 48,                     // Bottom sheet ~50px top corners
  pill: 999,                     // Pill-shaped buttons and toggles
  iconTile: 16,                  // Rounded-square blue icon tile
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const shadows = {
  card: {
    shadowColor: '#052224',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sheet: {
    shadowColor: '#052224',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};

export default {
  colors,
  typography,
  borderRadius,
  spacing,
  shadows,
};
