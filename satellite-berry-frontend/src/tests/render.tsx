import type { ReactElement } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createAppQueryClient } from '@/app/queryClient';

export function renderWithProviders(ui: ReactElement) {
  const queryClient = createAppQueryClient();

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>),
  };
}
