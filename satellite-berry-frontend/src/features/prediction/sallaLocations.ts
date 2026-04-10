/**
 * Known berry picking areas in Salla, Finland.
 * Each location maps berry types to real geographic coordinates
 * in and around the Salla municipality.
 */

export interface BerryLocation {
  id: string;
  berryNames: string[];
  lat: number;
  lng: number;
  areaName: string;
  description: string;
}

export const SALLA_CENTER = { lat: 66.833, lng: 28.667 } as const;
export const SALLA_DEFAULT_ZOOM = 10;

export const sallaLocations: BerryLocation[] = [
  {
    id: 'hautajarvi-lingonberry',
    berryNames: ['Lingonberry', 'lingonberry'],
    lat: 66.78,
    lng: 28.45,
    areaName: 'Hautajärvi',
    description:
      'Dense pine forests with excellent lingonberry patches. Easy access from the main road.',
  },
  {
    id: 'naruska-blueberry',
    berryNames: ['Blueberry', 'blueberry', 'Bilberry', 'bilberry'],
    lat: 66.92,
    lng: 29.1,
    areaName: 'Naruska',
    description:
      'Mixed spruce–birch forests rich in blueberry undergrowth. A popular local picking area.',
  },
  {
    id: 'tuntsa-cloudberry',
    berryNames: ['Cloudberry', 'cloudberry'],
    lat: 67.05,
    lng: 28.85,
    areaName: 'Tuntsa Wilderness',
    description:
      'Open bogs and marshlands where cloudberries thrive in summer. Bring waterproof boots!',
  },
  {
    id: 'sallatunturi-lingon',
    berryNames: ['Lingonberry', 'lingonberry'],
    lat: 66.85,
    lng: 28.72,
    areaName: 'Sallatunturi Fell',
    description:
      'Hillside forests around the fell area, great for lingonberry picking in early autumn.',
  },
  {
    id: 'aatsinki-blueberry',
    berryNames: ['Blueberry', 'blueberry', 'Bilberry', 'bilberry'],
    lat: 66.75,
    lng: 28.3,
    areaName: 'Aatsinki',
    description:
      'Old-growth forest with thick blueberry carpets. Reindeer are often spotted nearby.',
  },
  {
    id: 'kelloselka-cranberry',
    berryNames: ['Cranberry', 'cranberry', 'Bog cranberry', 'bog cranberry'],
    lat: 66.72,
    lng: 29.35,
    areaName: 'Kelloselkä',
    description:
      'Peat bogs at the eastern edge of Salla. Cranberries ripen late in the season here.',
  },
  {
    id: 'onkamonjarvi-cloudberry',
    berryNames: ['Cloudberry', 'cloudberry'],
    lat: 66.95,
    lng: 28.35,
    areaName: 'Onkamojärvi',
    description:
      'Remote mire areas near the lake. One of the best cloudberry spots in the region.',
  },
  {
    id: 'salla-center-crowberry',
    berryNames: ['Crowberry', 'crowberry', 'Black crowberry', 'black crowberry'],
    lat: 66.83,
    lng: 28.67,
    areaName: 'Salla Village Area',
    description:
      'Dry heathland around the village center where crowberries are commonly found.',
  },
  {
    id: 'ruuhitunturi-raspberry',
    berryNames: ['Raspberry', 'raspberry', 'Arctic raspberry', 'arctic raspberry'],
    lat: 66.88,
    lng: 28.55,
    areaName: 'Ruuhitunturi',
    description:
      'Forest clearings and trail edges where wild raspberries grow in sunny spots.',
  },
  {
    id: 'kursunjarvi-bearberry',
    berryNames: ['Bearberry', 'bearberry'],
    lat: 66.79,
    lng: 28.9,
    areaName: 'Kursunjärvi',
    description:
      'Rocky, well-drained hillsides with bearberry ground cover typical of Lapland terrain.',
  },
];

/**
 * Returns locations relevant to the given set of berry names,
 * matched case-insensitively. If no specific matches are found,
 * returns all locations so the user can still explore.
 */
export function getLocationsForBerries(berryNames: string[]): BerryLocation[] {
  const lowerNames = new Set(berryNames.map((n) => n.toLowerCase()));

  const matched = sallaLocations.filter((loc) =>
    loc.berryNames.some((b) => lowerNames.has(b.toLowerCase())),
  );

  return matched.length > 0 ? matched : sallaLocations;
}
