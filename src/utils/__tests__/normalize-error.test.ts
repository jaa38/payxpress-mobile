
import axios from "axios";

import { AppError } from "@/utils/errors/app-error";
import { normalizeError } from "@/utils/errors/normalize-error";

describe("normalizeError", () => {
  it("returns an AppError unchanged", () => {
    const error = new AppError({
      code: "API_ERROR",
      message: "Test error",
    });

    expect(normalizeError(error)).toBe(error);
  });

  it("normalizes a standard Error", () => {
    const originalError = new Error("Something failed");
    const result = normalizeError(originalError);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe("UNKNOWN_ERROR");
    expect(result.message).toBe("Something failed");
    expect(result.cause).toBe(originalError);
  });

  it("normalizes an unknown value", () => {
    const result = normalizeError("Something went wrong");

    expect(result.code).toBe("UNKNOWN_ERROR");
    expect(result.message).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("normalizes an Axios timeout error", () => {
    const error = new axios.AxiosError(
      "Timeout",
      "ECONNABORTED",
    );

    const result = normalizeError(error);

    expect(result.code).toBe("TIMEOUT_ERROR");
    expect(result.message).toBe(
      "The request timed out. Please try again.",
    );
    expect(result.cause).toBe(error);
  });

  it("normalizes an Axios network error", () => {
    const error = new axios.AxiosError("Network Error");

    const result = normalizeError(error);

    expect(result.code).toBe("NETWORK_ERROR");
    expect(result.message).toBe(
      "Unable to connect to the server. Please check your internet connection and try again.",
    );
  });

  it.each([401, 403])(
    "normalizes HTTP %i as an authentication error",
    (status) => {
      const error = new axios.AxiosError(
        "Unauthorized",
        undefined,
        undefined,
        undefined,
        {
          status,
          data: { message: "Session expired" },
          statusText: "Unauthorized",
          headers: {},
          config: {
            headers: new axios.AxiosHeaders(),
          },
        },
      );

      const result = normalizeError(error);

      expect(result.code).toBe("AUTH_ERROR");
      expect(result.status).toBe(status);
      expect(result.message).toBe(
        "Your session has expired. Please sign in again.",
      );
      expect(result.details).toEqual({
        message: "Session expired",
      });
    },
  );

  it("uses the server message for API errors", () => {
    const error = new axios.AxiosError(
      "Request failed",
      undefined,
      undefined,
      undefined,
      {
        status: 500,
        data: { message: "Internal server error" },
        statusText: "Internal Server Error",
        headers: {},
        config: {
          headers: new axios.AxiosHeaders(),
        },
      },
    );

    const result = normalizeError(error);

    expect(result.code).toBe("API_ERROR");
    expect(result.status).toBe(500);
    expect(result.message).toBe("Internal server error");
  });

  it("uses a fallback message when the server message is missing", () => {
    const error = new axios.AxiosError(
      "Request failed",
      undefined,
      undefined,
      undefined,
      {
        status: 500,
        data: { error: "Server failure" },
        statusText: "Internal Server Error",
        headers: {},
        config: {
          headers: new axios.AxiosHeaders(),
        },
      },
    );

    const result = normalizeError(error);

    expect(result.code).toBe("API_ERROR");
    expect(result.message).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
