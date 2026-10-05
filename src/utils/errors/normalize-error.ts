import axios from "axios";

import { AppError } from "./app-error";

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return new AppError({
        code: "TIMEOUT_ERROR",
        message:
          "The request timed out. Please try again.",
        cause: error,
      });
    }

    if (!error.response) {
      return new AppError({
        code: "NETWORK_ERROR",
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
        cause: error,
      });
    }

    const status = error.response.status;

    if (status === 401 || status === 403) {
      return new AppError({
        code: "AUTH_ERROR",
        message:
          "Your session has expired. Please sign in again.",
        status,
        details: error.response.data,
        cause: error,
      });
    }

    const responseMessage =
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
        ? error.response.data.message
        : undefined;

    return new AppError({
      code: "API_ERROR",
      message:
        responseMessage ??
        "Something went wrong. Please try again.",
      status,
      details: error.response.data,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppError({
      code: "UNKNOWN_ERROR",
      message: error.message,
      cause: error,
    });
  }

  return new AppError({
    code: "UNKNOWN_ERROR",
    message:
      "Something went wrong. Please try again.",
    cause: error,
  });
}
