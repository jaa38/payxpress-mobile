export type AppErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "AUTH_ERROR"
  | "VALIDATION_ERROR"
  | "API_ERROR"
  | "UNKNOWN_ERROR";

interface AppErrorOptions {
  code: AppErrorCode;
  message: string;
  status?: number;
  details?: unknown;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly details?: unknown;
  readonly cause?: unknown;

  constructor({
    code,
    message,
    status,
    details,
    cause,
  }: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.cause = cause;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
