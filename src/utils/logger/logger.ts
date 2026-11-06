
function formatMessage(message: string, context?: string): unknown[] {
  if (context === undefined) {
    return [message];
  }

  return [message, context];
}

export const logger = {
  debug(message: string, context?: string): void {
    if (!__DEV__) return;

    console.debug("[DEBUG]", ...formatMessage(message, context));
  },

  info(message: string, context?: string): void {
    if (!__DEV__) return;

    console.info("[INFO]", ...formatMessage(message, context));
  },

  warn(message: string, context?: string): void {
    if (!__DEV__) return;

    console.warn("[WARN]", ...formatMessage(message, context));
  },

  error(message: string, context?: string): void {
    if (!__DEV__) return;

    console.error("[ERROR]", ...formatMessage(message, context));
  },
};
