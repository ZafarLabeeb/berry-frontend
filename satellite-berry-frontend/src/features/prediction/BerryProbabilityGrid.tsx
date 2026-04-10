import { motion } from 'framer-motion';

import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { BerryProbability } from '@/lib/schemas/prediction';
import { formatPercent } from '@/lib/utils/format';

interface BerryProbabilityGridProps {
  probabilities: BerryProbability[];
  selectedBerryName: string;
  onViewOnMap?: (berryName: string) => void;
}

export function BerryProbabilityGrid({
  probabilities,
  selectedBerryName,
  onViewOnMap,
}: BerryProbabilityGridProps): JSX.Element {
  return (
    <Card className="space-y-5">
      <SectionHeading
        eyebrow="Results"
        title="Berries found for your terrain"
        description="Based on the land cover and soil in your image, these berries are most likely to grow there."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {probabilities.map((berry, index) => {
          const isSelected = berry.name === selectedBerryName;
          return (
            <motion.article
              key={berry.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className={[
                'rounded-[24px] border p-4 transition-all duration-200 ease-expressive',
                isSelected
                  ? 'border-forest-300/40 bg-forest-100/10 shadow-glow'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-soft"
                  style={{ backgroundColor: `${berry.color_hex}22` }}
                  aria-hidden="true"
                >
                  {berry.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">{berry.name}</p>
                  {isSelected && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-forest-200">
                      Best match
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-tight text-white">
                    {formatPercent(berry.probability)}
                  </p>
                  <span className="text-xs text-mutedForeground">likelihood</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-expressive"
                    style={{ width: `${berry.probability * 100}%`, backgroundColor: berry.color_hex }}
                  />
                </div>
              </div>

              {onViewOnMap && (
                <button
                  type="button"
                  onClick={() => onViewOnMap(berry.name)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-forest-600/60 bg-forest-600/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-forest-100 transition-all duration-200 hover:bg-forest-600/40 hover:border-forest-500"
                >
                  <span>📍</span>
                  <span>View on map</span>
                </button>
              )}
            </motion.article>
          );
        })}
      </div>
    </Card>
  );
}
