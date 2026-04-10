import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IMAGE_ACCEPT_VALUE, validateUploadFile } from '@/lib/utils/file';

import type { UploadFormValues } from './types';

interface UploadPanelProps {
  previewUrl: string | null;
  maxUploadSizeBytes: number;
}

export function UploadPanel({ previewUrl, maxUploadSizeBytes }: UploadPanelProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    control,
    clearErrors,
    setError,
    trigger,
    formState: { errors },
  } = useFormContext<UploadFormValues>();

  const { field, fieldState } = useController({
    control,
    name: 'file',
    defaultValue: null,
  });

  const selectedFile = field.value;

  const applyFile = async (file: File | null) => {
    const validationMessage = validateUploadFile(file ?? undefined, maxUploadSizeBytes);

    if (validationMessage) {
      field.onChange(null);
      setError('file', { type: 'validate', message: validationMessage });
      return;
    }

    clearErrors('file');
    field.onChange(file);
    await trigger('file');
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files.item(0);
    await applyFile(droppedFile);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <Card className="space-y-6">
      <SectionHeading
        eyebrow="Upload"
        title="Upload a forest or soil photo"
        description="Drag and drop or click to select an image. We'll analyze it to find matching wild berries."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
        {/* ── Drop zone ── */}
        <div className="space-y-3">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              void onDrop(event);
            }}
            onClick={openFilePicker}
            className={[
              'group relative grid min-h-[18rem] cursor-pointer place-items-center overflow-hidden rounded-[28px] border border-dashed px-6 py-8 transition-all duration-200 ease-expressive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isDragging
                ? 'border-forest-300 bg-forest-100/10 shadow-glow'
                : 'border-border bg-white/[0.03] hover:border-forest-300/70 hover:bg-white/[0.05]',
            ].join(' ')}
            aria-describedby="upload-help upload-error"
          >
            <input
              id="satellite-image-upload"
              aria-label="Forest or soil image upload"
              ref={(node) => {
                field.ref(node);
                inputRef.current = node;
              }}
              type="file"
              accept={IMAGE_ACCEPT_VALUE}
              className="sr-only"
              onChange={(event) => {
                const nextFile = event.target.files?.item(0) ?? null;
                void applyFile(nextFile);
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,138,102,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(126,28,62,0.12),transparent_34%)] opacity-70" />
            <div className="relative z-10 max-w-md space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl shadow-soft backdrop-blur">
                🌲
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">
                  {selectedFile ? selectedFile.name : 'Drop your image here'}
                </p>
                <p id="upload-help" className="text-sm leading-6 text-mutedForeground">
                  {selectedFile
                    ? 'Click again or drop a different file to replace it.'
                    : 'Supports PNG, JPEG, WebP, TIFF, and more.'}
                </p>
              </div>
            </div>
          </div>

          {(fieldState.error?.message || errors.file?.message) && (
            <p id="upload-error" className="text-sm text-berry-100">
              {fieldState.error?.message ?? errors.file?.message}
            </p>
          )}
        </div>

        {/* ── Preview ── */}
        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-4 shadow-soft">
          <div className="flex h-full flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-200">Preview</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Your image</h3>
            </div>
            <div className="relative flex min-h-[16rem] flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-surfaceStrong/80">
              {previewUrl && selectedFile ? (
                <img
                  src={previewUrl}
                  alt={`Preview of ${selectedFile.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="max-w-xs space-y-2 px-6 text-center">
                  <p className="text-3xl">📷</p>
                  <p className="text-sm font-medium text-foreground">No image yet</p>
                  <p className="text-sm leading-6 text-mutedForeground">
                    Select a photo to see a preview here before analyzing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
