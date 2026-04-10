import { useMutation } from '@tanstack/react-query';

import type { NormalizedApiError } from '@/lib/api/errors';
import { predictImage, type PredictImageParams } from '@/lib/api/prediction';
import type { PredictionResponse } from '@/lib/schemas/prediction';

export function usePredictionMutation() {
  return useMutation<PredictionResponse, NormalizedApiError, PredictImageParams>({
    mutationFn: predictImage,
  });
}
