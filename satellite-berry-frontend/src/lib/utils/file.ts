import { formatFileSize } from '@/lib/utils/format';

export const DEFAULT_MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
]);

export function isSupportedImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type);
}

export function validateUploadFile(
  file: File | undefined,
  maxUploadSizeBytes = DEFAULT_MAX_UPLOAD_SIZE_BYTES,
): string | null {
  if (!file) {
    return 'Choose a satellite image to analyze.';
  }

  if (!isSupportedImageType(file)) {
    return 'Only image uploads are supported. Use PNG, JPEG, WebP, TIFF, HEIC, GIF, or BMP.';
  }

  if (file.size > maxUploadSizeBytes) {
    return `The image is too large. Maximum upload size is ${formatFileSize(maxUploadSizeBytes)}.`;
  }

  return null;
}

export const IMAGE_ACCEPT_VALUE = Array.from(ALLOWED_IMAGE_TYPES).join(',');
