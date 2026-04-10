import { clamp } from '@/lib/utils/format';

async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to create image preview.'));
    };
    reader.onerror = () => reject(new Error('Unable to read the uploaded image.'));
    reader.readAsDataURL(file);
  });
}

export async function createPreviewImage(
  file: File,
  options?: {
    maxDimension?: number;
    quality?: number;
  },
): Promise<string> {
  const maxDimension = options?.maxDimension ?? 1600;
  const quality = clamp(options?.quality ?? 0.88, 0.6, 1);

  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Image === 'undefined') {
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      return URL.createObjectURL(file);
    }

    return await readFileAsDataUrl(file);
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to render image preview.'));
      nextImage.src = dataUrl;
    });

    const largestDimension = Math.max(image.width, image.height);
    if (!largestDimension || largestDimension <= maxDimension) {
      return dataUrl;
    }

    const scale = maxDimension / largestDimension;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');

    if (!context) {
      return dataUrl;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(file.type || 'image/jpeg', quality);
  } catch {
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      return URL.createObjectURL(file);
    }

    return await readFileAsDataUrl(file);
  }
}
