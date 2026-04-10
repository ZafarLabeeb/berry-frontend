const PNG_DATA_URI_PREFIX = 'data:image/png;base64,';

export function base64PngToDataUri(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  return `${PNG_DATA_URI_PREFIX}${trimmed}`;
}

export function safeBase64PngToDataUri(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  try {
    const parts = value.split(',');
    const normalized = value.includes(',') ? parts[parts.length - 1] ?? value : value;
    atob(normalized);

    return base64PngToDataUri(value);
  } catch {
    return null;
  }
}
