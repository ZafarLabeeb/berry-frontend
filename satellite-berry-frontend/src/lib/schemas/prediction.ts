import { z } from 'zod';

export const berryProbabilitySchema = z.object({
  name: z.string().min(1),
  emoji: z.string().min(1),
  color_hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  probability: z.number().min(0).max(1),
});

export const topModelProbabilitySchema = z.object({
  class_name: z.string().min(1),
  probability: z.number().min(0).max(1),
});

export const predictionResponseSchema = z.object({
  land_cover: z.object({
    name: z.string().min(1),
    raw_class_name: z.string().min(1),
    probability: z.number().min(0).max(1),
    soil: z.string().min(1),
  }),
  berry_probabilities: z.array(berryProbabilitySchema).min(1),
  selected_berry: berryProbabilitySchema,
  masked_image_base64: z.string().min(1),
  top_model_probabilities: z.array(topModelProbabilitySchema).min(1),
});

export type BerryProbability = z.infer<typeof berryProbabilitySchema>;
export type TopModelProbability = z.infer<typeof topModelProbabilitySchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;

export function parsePredictionResponse(payload: unknown): PredictionResponse {
  return predictionResponseSchema.parse(payload);
}
