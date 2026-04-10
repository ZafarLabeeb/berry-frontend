import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { ApiErrorBanner } from '@/components/ApiErrorBanner';
import { AppShell } from '@/app/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { NormalizedApiError } from '@/lib/api/errors';

import { BerryProbabilityGrid } from '@/features/prediction/BerryProbabilityGrid';
import { MaskedMapDisplay } from '@/features/prediction/MaskedMapDisplay';
import { MapAnalyzer } from '@/features/prediction/MapAnalyzer';
import { SallaMap } from '@/features/prediction/SallaMap';
import type { PredictionRunContext } from '@/features/prediction/types';
import { usePredictionMutation } from '@/features/prediction/usePredictionMutation';

const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024; // 50MB for map captures

const resultContainerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
      ease: [0.2, 0.8, 0.2, 1],
      duration: 0.4,
    },
  },
} as const;

const resultItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.2, 0.8, 0.2, 1] } },
} as const;

export function App(): JSX.Element {
  const [lastSuccessfulRun, setLastSuccessfulRun] = useState<PredictionRunContext | null>(null);
  const [lastSubmittedFile, setLastSubmittedFile] = useState<{ file: File; fileName: string } | null>(null);
  const [currentError, setCurrentError] = useState<NormalizedApiError | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [highlightBerry, setHighlightBerry] = useState<string | null>(null);

  const predictionMutation = usePredictionMutation();

  /* ── handle image capture from map ── */
  const handleImageCapture = (file: File) => {
    setCurrentError(null);
    setIsAnalyzing(true);
    setLastSubmittedFile({ file, fileName: file.name });
    setHighlightBerry(null);

    predictionMutation.mutate(
      { file },
      {
        onSuccess: (result) => {
          setCurrentError(null);
          setLastSuccessfulRun({
            result,
            previewUrl: '', // Map captures don't need a preview
            fileName: file.name,
          });
        },
        onError: (error) => {
          setCurrentError(error);
        },
        onSettled: () => {
          setIsAnalyzing(false);
        },
      },
    );
  };

  /* ── retry last ── */
  const handleRetry = () => {
    if (!lastSubmittedFile) return;

    setCurrentError(null);
    setIsAnalyzing(true);

    predictionMutation.mutate(
      { file: lastSubmittedFile.file },
      {
        onSuccess: (result) => {
          setCurrentError(null);
          setLastSuccessfulRun({
            result,
            previewUrl: '',
            fileName: lastSubmittedFile.fileName,
          });
        },
        onError: (error) => {
          setCurrentError(error);
        },
        onSettled: () => {
          setIsAnalyzing(false);
        },
      },
    );
  };

  /* ── reset ── */
  const handleReset = () => {
    predictionMutation.reset();
    setCurrentError(null);
    setIsAnalyzing(false);
    setLastSuccessfulRun(null);
    setLastSubmittedFile(null);
    setHighlightBerry(null);
  };

  /* ── "View on map" from berry card ── */
  const handleViewOnMap = (berryName: string) => {
    setHighlightBerry(berryName);
    document.getElementById('salla-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── berry names for the map filter ── */
  const berryNames = lastSuccessfulRun
    ? lastSuccessfulRun.result.berry_probabilities.map((b) => b.name)
    : [];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Map Analyzer */}
        <MapAnalyzer onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} />

        {/* ── Error ── */}
        {currentError && (
          <div className="mt-6">
            <ApiErrorBanner
              error={currentError}
              onRetry={lastSubmittedFile ? handleRetry : undefined}
              isRetrying={isAnalyzing}
            />
          </div>
        )}

        {/* ── Results ── */}
        <div className="mt-6">
          {lastSuccessfulRun ? (
            <motion.section
              variants={resultContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Land cover + soil summary */}
              <motion.div variants={resultItemVariants}>
                <Card className="space-y-3 bg-surfaceElevated/80">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl">🌍</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-200">
                        Terrain detected
                      </p>
                      <h2 className="font-display text-2xl tracking-tight text-white sm:text-3xl">
                        {lastSuccessfulRun.result.land_cover.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-mutedForeground">
                    Your image shows{' '}
                    <span className="font-semibold text-white">
                      {lastSuccessfulRun.result.land_cover.name}
                    </span>{' '}
                    terrain with{' '}
                    <span className="font-semibold text-white">
                      {lastSuccessfulRun.result.land_cover.soil}
                    </span>{' '}
                    soil characteristics — here are the berries that thrive in this environment.
                  </p>
                </Card>
              </motion.div>

              {/* Masked map display */}
              <motion.div variants={resultItemVariants}>
                <MaskedMapDisplay
                  imageBase64={lastSuccessfulRun.result.masked_image_base64}
                  fileName={lastSuccessfulRun.fileName}
                />
              </motion.div>

              {/* Berry grid */}
              <motion.div variants={resultItemVariants}>
                <BerryProbabilityGrid
                  probabilities={lastSuccessfulRun.result.berry_probabilities}
                  selectedBerryName={lastSuccessfulRun.result.selected_berry.name}
                  onViewOnMap={handleViewOnMap}
                />
              </motion.div>

              {/* Salla Map */}
              <motion.div variants={resultItemVariants}>
                <SallaMap berryNames={berryNames} highlightBerry={highlightBerry} />
              </motion.div>

              {/* Reset button */}
              <motion.div variants={resultItemVariants} className="flex justify-center pt-4">
                <Button size="lg" variant="secondary" onClick={handleReset}>
                  Analyze another area
                </Button>
              </motion.div>
            </motion.section>
          ) : (
            <Card className="grid min-h-[18rem] place-items-center overflow-hidden border-white/8 bg-surface/70 text-center">
              <div className="max-w-md space-y-4 px-6">
                <p className="text-4xl">📍</p>
                <h2 className="font-display text-2xl tracking-tight text-white sm:text-3xl">
                  Select area to analyze
                </h2>
                <p className="text-sm leading-7 text-mutedForeground">
                  Use the map above to draw a rectangle around the area you want to analyze for wild berries. Click "Analyze" to get started.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
