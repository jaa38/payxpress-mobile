const isDevelopment = process.env.EXPO_PUBLIC_ENVIRONMENT === "development";

function formatMessage(message: string, context?: unknown): unknown[] {
  if (context === undefined) {
    return [message];
  }

  return [message, context];
}

export const logger = {
  debug(message: string, context?: unknown): void {
    if (!isDevelopment) {
      return;
    }

    console.debug("[DEBUG]", ...formatMessage(message, context));
  },

  info(message: string, context?: unknown): void {
    if (!isDevelopment) {
      return;
    }

    console.info("[INFO]", ...formatMessage(message, context));
  },

  warn(message: string, context?: unknown): void {
    if (!isDevelopment) {
      return;
    }

    console.warn("[WARN]", ...formatMessage(message, context));
  },

  error(message: string, error?: unknown): void {
    console.error("[ERROR]", ...formatMessage(message, error));
  },
};
