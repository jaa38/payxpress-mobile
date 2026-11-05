
import { colors } from "./colors";

/**
 * Recursively widens string literal values to string
 * while preserving the nested theme structure.
 */
type DeepString<T> = {
  [K in keyof T]: T[K] extends string
  ? string
  : T[K] extends object
  ? DeepString<T[K]>
  : T[K];
};

export const lightTheme = {
  text: {
    primary: colors.gray[900],
    heading: colors.gray[800],
    strong: colors.gray[700],
    secondary: colors.gray[600],
    label: colors.gray[550],
    muted: colors.gray[500],
    placeholder: colors.gray[400],
    inverse: colors.neutral.white,
    brand: colors.primary[500],
    accent: colors.secondary[500],
    success: colors.success[600],
    error: colors.error[600],
    warning: colors.warning[600],
    info: colors.info[600],
    link: colors.secondary[500],
  },

  icon: {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success[600],
    error: colors.error[600],
    warning: colors.warning[600],
    info: colors.info[600],
    inverse: colors.neutral.white,
  },

  background: {
    primary: colors.gray[50],
    surface: colors.neutral.white,
    subtle: colors.gray[100],
    brand: colors.primary[50],
    brandui: colors.primary[100],
    accent: colors.secondary[50],
    success: colors.success[100],
    error: colors.error[100],
    warning: colors.warning[100],
    info: colors.info[100],
    inverse: colors.gray[900],
    overlay: "rgba(0,0,0,0.4)",
  },

  border: {
    default: colors.gray[200],
    light: colors.gray[100],
    strong: colors.gray[300],
    focus: colors.primary[500],
    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[500],
    info: colors.info[500],
    brand: colors.primary[500],
    accent: colors.secondary[500],
  },

  action: {
    primary: {
      background: colors.primary[500],
      pressed: colors.primary[600],
      disabled: colors.gray[300],
      text: colors.neutral.white,
      disabledText: colors.gray[500],
    },

    secondary: {
      background: colors.secondary[500],
      pressed: colors.secondary[600],
      disabled: colors.gray[300],
      text: colors.neutral.white,
      disabledText: colors.gray[500],
    },

    destructive: {
      background: colors.error[500],
      pressed: colors.error[600],
      text: colors.neutral.white,
    },

    tertiary: {
      background: colors.neutral.white,
      border: colors.primary[500],
      text: colors.primary[500],
      pressed: colors.primary[50],
    },

    ghost: {
      background: colors.neutral.transparent,
      pressed: colors.primary[50],
      text: colors.primary[500],
    },

    link: {
      text: colors.secondary[500],
      pressed: colors.secondary[600],
    },
  },

  input: {
    background: colors.neutral.white,
    text: colors.gray[900],
    placeholder: colors.gray[400],
    border: colors.gray[200],
    focusBorder: colors.primary[500],
    disabledBackground: colors.gray[100],
    disabledText: colors.gray[400],
    errorBorder: colors.error[500],
    successBorder: colors.success[500],
    label: colors.gray[700],
    helper: colors.gray[500],
    icon: colors.gray[500],
  },

  card: {
    default: {
      background: colors.neutral.white,
      border: colors.gray[200],
    },

    dashboard: {
      background: colors.primary[500],
      headerText: colors.primary[100],
      text: colors.primary[50],
    },

    active: {
      background: colors.primary[50],
      border: colors.primary[500],
    },

    success: {
      background: colors.success[100],
      border: colors.success[500],
    },

    error: {
      background: colors.error[100],
      border: colors.error[500],
    },

    warning: {
      background: colors.warning[100],
      border: colors.warning[500],
    },

    info: {
      background: colors.info[100],
      border: colors.info[500],
    },

    disabled: {
      background: colors.gray[100],
      border: colors.gray[300],
    },
  },

  badge: {
    primary: {
      background: colors.primary[100],
      text: colors.primary[600],
    },

    secondary: {
      background: colors.secondary[100],
      text: colors.secondary[600],
    },

    success: {
      background: colors.success[100],
      text: colors.success[600],
    },

    error: {
      background: colors.error[100],
      text: colors.error[600],
    },

    warning: {
      background: colors.warning[100],
      text: colors.warning[600],
    },

    info: {
      background: colors.info[100],
      text: colors.info[600],
    },
  },

  transaction: {
    success: {
      background: colors.success[100],
      border: colors.success[500],
      text: colors.success[600],
    },

    pending: {
      background: colors.warning[100],
      border: colors.warning[500],
      text: colors.warning[600],
    },

    failed: {
      background: colors.error[100],
      border: colors.error[500],
      text: colors.error[600],
    },

    processing: {
      background: colors.info[100],
      border: colors.info[500],
      text: colors.info[600],
    },
  },

  wallet: {
    background: colors.primary[500],
    text: colors.neutral.white,
    secondaryText: colors.primary[100],
  },

  navigation: {
    background: colors.neutral.white,
    border: colors.gray[200],
    active: colors.primary[500],
    inactive: colors.gray[400],
    textActive: colors.primary[500],
    textInactive: colors.gray[500],
  },

  divider: {
    default: colors.gray[200],
    subtle: colors.gray[100],
    strong: colors.gray[300],
  },

  overlay: {
    background: "rgba(0,0,0,0.5)",
  },
};

export type AppTheme = DeepString<typeof lightTheme>;

export const darkTheme: AppTheme = {
  ...lightTheme,

  text: {
    ...lightTheme.text,
    primary: "#F9FAFB",
    heading: "#F3F4F6",
    strong: "#E5E7EB",
    secondary: "#D1D5DB",
    label: "#C4CAD3",
    muted: "#9CA3AF",
    placeholder: "#6B7280",
    inverse: "#111827",
    brand: "#69BD69",
    accent: "#FFAA66",
    success: "#4ADE80",
    error: "#F87171",
    warning: "#FBBF24",
    info: "#60A5FA",
    link: "#FFAA66",
  },

  icon: {
    ...lightTheme.icon,
    primary: "#69BD69",
    secondary: "#FFAA66",
    success: "#4ADE80",
    error: "#F87171",
    warning: "#FBBF24",
    info: "#60A5FA",
    inverse: "#111827",
  },

  background: {
    ...lightTheme.background,
    primary: "#111827",
    surface: "#1F2937",
    subtle: "#273449",
    brand: "#18351D",
    brandui: "#244B2A",
    accent: "#3D291C",
    success: "#153B2A",
    error: "#451F25",
    warning: "#44351A",
    info: "#1D3555",
    inverse: "#F9FAFB",
    overlay: "rgba(0,0,0,0.65)",
  },

  border: {
    ...lightTheme.border,
    default: "#374151",
    light: "#273449",
    strong: "#4B5563",
    focus: "#69BD69",
    success: "#16A34A",
    error: "#DC2626",
    warning: "#D97706",
    info: "#2563EB",
    brand: "#69BD69",
    accent: "#FFAA66",
  },

  action: {
    ...lightTheme.action,

    primary: {
      ...lightTheme.action.primary,
      background: colors.primary[500],
      pressed: colors.primary[600],
      disabled: "#374151",
      text: colors.neutral.white,
      disabledText: "#9CA3AF",
    },

    secondary: {
      ...lightTheme.action.secondary,
      disabled: "#374151",
      disabledText: "#9CA3AF",
    },

    tertiary: {
      background: "#1F2937",
      border: "#69BD69",
      text: "#69BD69",
      pressed: "#18351D",
    },

    ghost: {
      background: colors.neutral.transparent,
      pressed: "#18351D",
      text: "#69BD69",
    },
  },

  input: {
    ...lightTheme.input,
    background: "#1F2937",
    text: "#F9FAFB",
    placeholder: "#9CA3AF",
    border: "#4B5563",
    focusBorder: "#69BD69",
    disabledBackground: "#273449",
    disabledText: "#6B7280",
    errorBorder: "#F87171",
    successBorder: "#4ADE80",
    label: "#D1D5DB",
    helper: "#9CA3AF",
    icon: "#9CA3AF",
  },

  card: {
    ...lightTheme.card,

    default: {
      background: "#1F2937",
      border: "#374151",
    },

    active: {
      background: "#18351D",
      border: "#69BD69",
    },

    success: {
      background: "#153B2A",
      border: "#16A34A",
    },

    error: {
      background: "#451F25",
      border: "#DC2626",
    },

    warning: {
      background: "#44351A",
      border: "#D97706",
    },

    info: {
      background: "#1D3555",
      border: "#2563EB",
    },

    disabled: {
      background: "#273449",
      border: "#374151",
    },
  },

  badge: {
    primary: {
      background: "#244B2A",
      text: "#9BD39B",
    },
    secondary: {
      background: "#4A2C1A",
      text: "#FFC799",
    },
    success: {
      background: "#153B2A",
      text: "#4ADE80",
    },
    error: {
      background: "#451F25",
      text: "#F87171",
    },
    warning: {
      background: "#44351A",
      text: "#FBBF24",
    },
    info: {
      background: "#1D3555",
      text: "#60A5FA",
    },
  },

  transaction: {
    success: {
      background: "#153B2A",
      border: "#16A34A",
      text: "#4ADE80",
    },
    pending: {
      background: "#44351A",
      border: "#D97706",
      text: "#FBBF24",
    },
    failed: {
      background: "#451F25",
      border: "#DC2626",
      text: "#F87171",
    },
    processing: {
      background: "#1D3555",
      border: "#2563EB",
      text: "#60A5FA",
    },
  },

  wallet: {
    background: "#005A01",
    text: "#FFFFFF",
    secondaryText: "#CDE9CD",
  },

  navigation: {
    background: "#1F2937",
    border: "#374151",
    active: "#69BD69",
    inactive: "#9CA3AF",
    textActive: "#69BD69",
    textInactive: "#9CA3AF",
  },

  divider: {
    default: "#374151",
    subtle: "#273449",
    strong: "#4B5563",
  },

  overlay: {
    background: "rgba(0,0,0,0.7)",
  },
};

// Temporary backwards compatibility for existing static imports.
export const theme = lightTheme;

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
