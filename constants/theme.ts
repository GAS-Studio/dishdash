// Design tokens — DishDash brand system (from Stitch "Modern Gourmet" theme)
// Primary: #E2725B  Secondary: #8A9A5B  Tertiary: #F4C430  Neutral: #956E60
export const colors = {
  // ── Primary — Terracotta Coral ──
  primary: '#E2725B',
  onPrimary: '#ffffff',
  primaryContainer: '#F7D5CC',   // light coral tint
  onPrimaryContainer: '#5C1A0A', // deep brown

  // ── Secondary — Olive Green ──
  secondary: '#8A9A5B',
  onSecondary: '#ffffff',
  secondaryContainer: '#DDE7BE', // light olive
  onSecondaryContainer: '#3A4422',

  // ── Tertiary — Golden Yellow ──
  tertiary: '#F4C430',
  onTertiary: '#3D2E00',
  tertiaryContainer: '#FDE9A0',  // light yellow
  onTertiaryContainer: '#3D2E00',

  // ── Neutral — Warm Brown ──
  neutral: '#956E60',

  // ── Surface & Background ──
  background: '#FDF0EB',         // warm peach cream
  onBackground: '#3D1A0A',

  surface: '#FDF0EB',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#FDF0EB',
  surfaceContainer: '#F5E3D9',
  surfaceContainerHigh: '#EDD3C5',
  surfaceContainerHighest: '#E5C4B2',

  onSurface: '#3D1A0A',          // deep warm brown
  onSurfaceVariant: '#956E60',   // neutral mid-brown

  // ── Outline ──
  outline: '#B8846E',
  outlineVariant: '#E5C4B2',

  // ── Error ──
  error: '#BA1A1A',
  onError: '#ffffff',
};

// ── Typography ──
// Plus Jakarta Sans — matches Stitch "Modern Gourmet" design
export const fonts = {
  display: 'PlusJakartaSans_800ExtraBold',
  displayBold: 'PlusJakartaSans_700Bold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};
