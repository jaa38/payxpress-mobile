import { colors } from './colors';

export const theme = {
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

    overlay: 'rgba(0,0,0,0.4)',
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
    background: 'rgba(0,0,0,0.5)',
  },
} as const;
