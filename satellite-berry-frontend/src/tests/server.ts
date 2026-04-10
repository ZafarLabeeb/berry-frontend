import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { predictionFixture } from '@/tests/fixtures';

const API_BASE_URL = 'http://localhost:8000';

export const server = setupServer(
  http.get(`${API_BASE_URL}/health`, () => HttpResponse.json({ status: 'ok' })),
  http.post(`${API_BASE_URL}/predict`, () => HttpResponse.json(predictionFixture)),
);
