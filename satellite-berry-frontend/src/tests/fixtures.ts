import type { PredictionResponse } from '@/lib/schemas/prediction';

export const predictionFixture: PredictionResponse = {
  land_cover: {
    name: 'Boreal Forest Edge',
    raw_class_name: 'boreal_forest_edge',
    probability: 0.9234,
    soil: 'Moraine',
  },
  berry_probabilities: [
    {
      name: 'Blueberry',
      emoji: '🫐',
      color_hex: '#4C6FFF',
      probability: 0.5,
    },
    {
      name: 'Lingonberry',
      emoji: '🔴',
      color_hex: '#C2294E',
      probability: 0.3,
    },
    {
      name: 'Cloudberry',
      emoji: '🟠',
      color_hex: '#F3A64A',
      probability: 0.2,
    },
  ],
  selected_berry: {
    name: 'Blueberry',
    emoji: '🫐',
    color_hex: '#4C6FFF',
    probability: 0.5,
  },
  masked_image_base64:
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==',
  top_model_probabilities: [
    { class_name: 'boreal_forest_edge', probability: 0.9234 },
    { class_name: 'mixed_forest', probability: 0.0512 },
    { class_name: 'peatland_margin', probability: 0.0254 },
  ],
};

export const alternativePredictionFixture: PredictionResponse = {
  land_cover: {
    name: 'Open Peatland Margin',
    raw_class_name: 'open_peatland_margin',
    probability: 0.8123,
    soil: 'Peat',
  },
  berry_probabilities: [
    {
      name: 'Cloudberry',
      emoji: '🟠',
      color_hex: '#F3A64A',
      probability: 0.65,
    },
    {
      name: 'Blueberry',
      emoji: '🫐',
      color_hex: '#4C6FFF',
      probability: 0.2,
    },
    {
      name: 'Lingonberry',
      emoji: '🔴',
      color_hex: '#C2294E',
      probability: 0.15,
    },
  ],
  selected_berry: {
    name: 'Cloudberry',
    emoji: '🟠',
    color_hex: '#F3A64A',
    probability: 0.65,
  },
  masked_image_base64:
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==',
  top_model_probabilities: [
    { class_name: 'open_peatland_margin', probability: 0.8123 },
    { class_name: 'boreal_mire', probability: 0.1312 },
    { class_name: 'wetland_transition', probability: 0.0565 },
  ],
};
