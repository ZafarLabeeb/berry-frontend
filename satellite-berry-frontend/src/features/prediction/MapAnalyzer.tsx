import { useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import html2canvas from 'html2canvas';

import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

const SALLA_CENTER = { lat: 66.87, lng: 27.65 };
const DEFAULT_ZOOM = 12;
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '500px',
  borderRadius: '22px',
};

interface MapAnalyzerProps {
  onImageCapture: (file: File) => void;
  isAnalyzing?: boolean;
}

export function MapAnalyzer({ onImageCapture, isAnalyzing = false }: MapAnalyzerProps): JSX.Element {
  const mapRef = useRef<google.maps.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <Card className="space-y-6 border-red-500/20 bg-red-500/5">
        <SectionHeading
          eyebrow="Configuration Required"
          title="Google Maps API Key Missing"
          description="Please add your Google Maps API key to get started"
        />
        <div className="space-y-3 text-sm">
          <p className="text-mutedForeground">
            1. Get an API key from{' '}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-300 hover:text-forest-200 underline"
            >
              Google Cloud Console
            </a>
          </p>
          <p className="text-mutedForeground">
            2. Enable the <strong>Maps JavaScript API</strong> for your project
          </p>
          <p className="text-mutedForeground">
            3. Add the key to your <code className="bg-black/30 px-2 py-1 rounded">.env</code> file:
          </p>
          <code className="block bg-black/40 p-3 rounded text-xs whitespace-pre-wrap break-words">
            VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
          </code>
          <p className="text-mutedForeground">4. Restart the development server</p>
        </div>
      </Card>
    );
  }

  const captureVisibleMap = async () => {
    if (!containerRef.current) return;

    setIsCapturing(true);

    try {
      // Capture the visible map area
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Convert canvas to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'map-area.png', { type: 'image/png' });
          onImageCapture(file);
        }
        setIsCapturing(false);
      });
    } catch (error) {
      console.error('Error capturing map:', error);
      alert('Failed to capture map area. Please try again.');
      setIsCapturing(false);
    }
  };

  return (
    <Card className="space-y-6">
      <SectionHeading
        eyebrow="Analysis"
        title="Select map view to analyze"
        description="Adjust the Google Map to the area you want to analyze, then click Analyze to send the visible portion to the backend."
      />

      <div className="space-y-4">
        {/* Google Map */}
        <div
          ref={containerRef}
          className="overflow-hidden rounded-[22px] border border-white/8 bg-black/30"
          style={{ height: 500 }}
        >
          {mapError && (
            <div className="flex items-center justify-center h-full bg-red-900/20 border border-red-500/50 rounded-lg m-1">
              <div className="text-center px-4">
                <p className="text-red-400 font-semibold mb-2">Map Failed to Load</p>
                <p className="text-sm text-mutedForeground mb-4">{mapError}</p>
                <p className="text-xs text-mutedForeground">
                  Please check your Google Maps API key configuration
                </p>
              </div>
            </div>
          )}
          {!mapError && (
            <LoadScript
              googleMapsApiKey={apiKey}
              onLoad={() => setMapError(null)}
              onError={() =>
                setMapError(
                  'Invalid API key or Maps JavaScript API not enabled. Check Google Cloud Console.'
                )
              }
            >
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={SALLA_CENTER}
                zoom={DEFAULT_ZOOM}
                onLoad={(map) => {
                  mapRef.current = map;
                  setMapError(null);
                }}
                onError={() =>
                  setMapError(
                    'Failed to initialize map. Check your API key configuration.'
                  )
                }
                options={{
                  mapTypeId: 'satellite',
                  fullscreenControl: true,
                  zoomControl: true,
                  mapTypeControl: true,
                }}
              />
            </LoadScript>
          )}
        </div>

        {/* Info text */}
        <p className="text-sm text-mutedForeground">
          Pan and zoom the map to select the area you want to analyze. The visible portion will be captured and sent to the backend.
        </p>

        {/* Analyze button */}
        <Button
          type="button"
          size="lg"
          disabled={isAnalyzing || isCapturing || !!mapError}
          onClick={captureVisibleMap}
          leadingIcon="📸"
          className="w-full sm:w-auto"
        >
          {isCapturing ? 'Capturing…' : isAnalyzing ? 'Analyzing…' : 'Analyze'}
        </Button>
      </div>
    </Card>
  );
}
