import type { PredictionResponse } from '@/lib/schemas/prediction';

export interface UploadFormValues {
  file: File | null;
}

export interface PredictionRunContext {
  result: PredictionResponse;
  previewUrl: string;
  fileName: string;
}
