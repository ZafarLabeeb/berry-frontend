import axios, { type AxiosError } from 'axios';
import { ZodError } from 'zod';

export interface NormalizedApiErrorShape {
  message: string;
  status?: number;
  details?: string;
  retryable: boolean;
}

export class ApiError extends Error implements NormalizedApiErrorShape {
  status?: number;
  details?: string;
  retryable: boolean;

  constructor({ message, status, details, retryable }: NormalizedApiErrorShape) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

export type NormalizedApiError = ApiError;

function extractMessageFromPayload(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  if ('detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  if ('message' in data && typeof data.message === 'string') {
    return data.message;
  }

  return undefined;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ApiError({
      message: 'The prediction service responded with an unexpected payload.',
      details: error.issues.map((issue) => issue.message).join('; '),
      retryable: true,
    });
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const payloadMessage = extractMessageFromPayload(axiosError.response?.data);

    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError({
        message: 'The request timed out before the prediction completed.',
        details: payloadMessage,
        retryable: true,
        status,
      });
    }

    if (!axiosError.response) {
      return new ApiError({
        message: 'Unable to reach the prediction service. Check your network connection and backend URL.',
        retryable: true,
      });
    }

    if (status === 400) {
      return new ApiError({
        message: payloadMessage ?? 'The uploaded file could not be processed by the prediction service.',
        retryable: false,
        status,
      });
    }

    if (status === 413) {
      return new ApiError({
        message: 'The image is too large for the backend to accept. Try a smaller upload.',
        retryable: false,
        status,
      });
    }

    if (status && status >= 500) {
      return new ApiError({
        message: payloadMessage ?? 'The prediction service encountered a server error.',
        retryable: true,
        status,
      });
    }

    return new ApiError({
      message: payloadMessage ?? 'The request could not be completed.',
      retryable: status ? status >= 500 : true,
      status,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      retryable: true,
    });
  }

  return new ApiError({
    message: 'Something went wrong while talking to the prediction service.',
    retryable: true,
  });
}
