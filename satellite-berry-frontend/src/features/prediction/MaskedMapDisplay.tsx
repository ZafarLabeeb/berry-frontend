import { motion } from 'framer-motion';

import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface MaskedMapDisplayProps {
  imageBase64: string;
  fileName: string;
}

export function MaskedMapDisplay({ imageBase64, fileName }: MaskedMapDisplayProps): JSX.Element {
  const imageSrc = `data:image/png;base64,${imageBase64}`;

  return (
    <Card className="space-y-5 overflow-hidden">
      <SectionHeading
        eyebrow="Analysis"
        title="Masked satellite map"
        description="Colors represent detected berry locations and land cover types in your image."
      />

      <div className="overflow-hidden rounded-[22px] border border-white/8 bg-black/20">
        <img
          src={imageSrc}
          alt={`Masked analysis of ${fileName}`}
          className="h-auto w-full"
          loading="lazy"
        />
      </div>
    </Card>
  );
}
