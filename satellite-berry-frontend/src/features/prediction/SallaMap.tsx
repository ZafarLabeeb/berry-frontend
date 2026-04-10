import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { BerryLocation } from './sallaLocations';
import { SALLA_CENTER, SALLA_DEFAULT_ZOOM, getLocationsForBerries } from './sallaLocations';

/* ── fix Leaflet default marker icons in bundled builds ── */
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ── custom berry marker ── */
function createBerryIcon(): L.DivIcon {
  return L.divIcon({
    className: 'salla-berry-marker',
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;border-radius:50%;
      background:linear-gradient(135deg,#406f4b,#5f8c69);
      border:2px solid rgba(255,255,255,0.25);
      box-shadow:0 4px 14px rgba(0,0,0,0.35);
      font-size:18px;line-height:1;
    ">🫐</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

interface SallaMapProps {
  berryNames: string[];
  highlightBerry?: string | null;
}

export function SallaMap({ berryNames, highlightBerry }: SallaMapProps): JSX.Element {
  const mapRef = useRef<L.Map | null>(null);
  const locations: BerryLocation[] = getLocationsForBerries(berryNames);
  const berryIcon = createBerryIcon();

  /* fly to a highlighted berry's first location when user clicks "View on map" */
  useEffect(() => {
    if (!highlightBerry || !mapRef.current) return;
    const target = locations.find((l) =>
      l.berryNames.some((b) => b.toLowerCase() === highlightBerry.toLowerCase()),
    );
    if (target) {
      mapRef.current.flyTo([target.lat, target.lng], 12, { duration: 1.2 });
    }
  }, [highlightBerry, locations]);

  return (
    <Card id="salla-map" className="space-y-5 overflow-hidden">
      <SectionHeading
        eyebrow="Berry picking locations"
        title="Explore Salla, Finland"
        description="Tap a marker to see details about each berry picking area. Click 'Open in Google Maps' for directions."
      />

      <div className="overflow-hidden rounded-[22px] border border-white/8" style={{ height: 420 }}>
        <MapContainer
          center={[SALLA_CENTER.lat, SALLA_CENTER.lng]}
          zoom={SALLA_DEFAULT_ZOOM}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={berryIcon}>
              <Popup>
                <div style={{ minWidth: 180, fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>
                    {loc.areaName}
                  </p>
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#406f4b',
                    }}
                  >
                    {loc.berryNames[0]}
                  </p>
                  <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.5, color: '#444' }}>
                    {loc.description}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: 8,
                      background: '#406f4b',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
