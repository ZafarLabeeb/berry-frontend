import type { AxiosProgressEvent } from 'axios';

import { apiClient } from '@/lib/api/client';
import { normalizeApiError } from '@/lib/api/errors';
import { parsePredictionResponse, type PredictionResponse } from '@/lib/schemas/prediction';

export interface PredictImageParams {
  file: File;
  seed?: number;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
}

export async function predictImage({ file, seed, onUploadProgress }: PredictImageParams): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<unknown>('/predict', formData, {
      params: typeof seed === 'number' && Number.isFinite(seed) ? { seed } : undefined,
      onUploadProgress,
    });

    return parsePredictionResponse(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
