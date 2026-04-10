import type { NormalizedApiError } from '@/lib/api/errors';
import { Button } from '@/components/ui/Button';

interface ApiErrorBannerProps {
  error: NormalizedApiError;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ApiErrorBanner({
  error,
  onRetry,
  isRetrying = false,
}: ApiErrorBannerProps): JSX.Element {
  return (
    <div
      role="alert"
      className="rounded-[24px] border border-berry-300/30 bg-berry-100/10 p-5 shadow-soft backdrop-blur"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-berry-100">Prediction error</p>
          <div className="space-y-1">
            <p className="text-base font-semibold text-white">{error.message}</p>
            {error.details ? <p className="text-sm text-berry-100/85">{error.details}</p> : null}
            {error.status ? (
              <p className="text-xs uppercase tracking-[0.18em] text-berry-100/70">HTTP {error.status}</p>
            ) : null}
          </div>
        </div>

        {onRetry ? (
          <Button variant="secondary" onClick={onRetry} disabled={isRetrying} leadingIcon="↻">
            {isRetrying ? 'Retrying…' : 'Retry prediction'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
