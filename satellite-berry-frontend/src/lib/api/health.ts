import { apiClient } from '@/lib/api/client';
import { normalizeApiError } from '@/lib/api/errors';

interface HealthResponse {
  status: string;
}

export async function getHealthStatus(): Promise<'ok'> {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    if (response.data.status !== 'ok') {
      throw new Error('Prediction service is not healthy.');
    }

    return 'ok';
  } catch (error) {
    throw normalizeApiError(error);
  }
}
