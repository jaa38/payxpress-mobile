export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development',
} as const;
