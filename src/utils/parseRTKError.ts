import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface ErrorResponse {
  message?: string;
  [key: string]: unknown;
}

export const parseRTKError = (
  error: unknown,
  fallbackMessage = "Something went wrong."
): string => {
  const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError =>
    typeof err === "object" && err !== null && "status" in err;

  const isSerializedError = (err: unknown): err is SerializedError =>
    typeof err === "object" && err !== null && "message" in err;

  if (isFetchBaseQueryError(error)) {
    const fetchError = error;
    const data = fetchError.data;

    if (typeof data === "string") {
      return `Error ${fetchError.status}: ${data}`;
    } else if (typeof data === "object" && data !== null) {
      const typedData = data as ErrorResponse;
      return `Error ${fetchError.status}: ${typedData.message ?? fallbackMessage}`;
    } else {
      return `Error ${fetchError.status}: ${fallbackMessage}`;
    }
  }

  if (isSerializedError(error)) {
    return `Error: ${error.message ?? fallbackMessage}`;
  }

  return fallbackMessage;
};
