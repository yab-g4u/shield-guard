import { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export interface ThreatArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  severity: 'normal' | 'suspicious' | 'blocked';
  value?: number;
}

export interface ThreatHotspot {
  lat: number;
  lng: number;
  intensity: number;
  label: string;
}

const ARC_COLORS: Record<ThreatArc['severity'], string[]> = {
  normal: ['rgba(230,230,230,0.52)', 'rgba(209,209,209,0.15)'],
  suspicious: ['rgba(245,158,11,0.72)', 'rgba(245,158,11,0.14)'],
  blocked: ['rgba(239,68,68,0.8)', 'rgba(239,68,68,0.2)'],
};

interface GlobeComponentProps {
  arcs?: ThreatArc[];
  hotspots?: ThreatHotspot[];
}

export const GlobeComponent = ({ arcs = [], hotspots = [] }: GlobeComponentProps) => {
  const globeEl = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [ringTicker, setRingTicker] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
           setDimensions({
             width: entry.contentRect.width,
             height: entry.contentRect.height
           });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.28;
      globeEl.current.controls().enablePan = false;
      globeEl.current.pointOfView({ lat: 18, lng: 12, altitude: 2.2 }, 1200);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRingTicker((v) => (v + 1) % 10000), 2200);
    return () => clearInterval(t);
  }, []);

  const fallbackArcs = useMemo<ThreatArc[]>(
    () =>
      [...Array(18).keys()].map((i) => ({
        startLat: (Math.random() - 0.5) * 140,
        startLng: (Math.random() - 0.5) * 320,
        endLat: (Math.random() - 0.5) * 140,
        endLng: (Math.random() - 0.5) * 320,
        severity: i % 7 === 0 ? 'blocked' : i % 4 === 0 ? 'suspicious' : 'normal',
        value: 1 + Math.round(Math.random() * 8),
      })),
    []
  );

  const fallbackHotspots = useMemo<ThreatHotspot[]>(
    () => [
      { lat: 1.2921, lng: 36.8219, intensity: 0.8, label: 'Nairobi' },
      { lat: 51.5072, lng: -0.1276, intensity: 0.6, label: 'London' },
      { lat: 40.7128, lng: -74.006, intensity: 0.75, label: 'New York' },
      { lat: 25.2048, lng: 55.2708, intensity: 0.7, label: 'Dubai' },
      { lat: 19.076, lng: 72.8777, intensity: 0.65, label: 'Mumbai' },
    ],
    []
  );

  const arcData = arcs.length ? arcs : fallbackArcs;
  const hotspotData = hotspots.length ? hotspots : fallbackHotspots;
  const ringsData = hotspotData
    .filter((h) => h.intensity >= 0.55)
    .map((h, idx) => ({ ...h, id: `${idx}-${ringTicker}` }));

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#030303]">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={arcData}
        arcColor={(d: object) => ARC_COLORS[(d as ThreatArc).severity]}
        arcStroke={0.35}
        arcDashLength={(d: object) => ((d as ThreatArc).severity === 'blocked' ? 0.24 : 0.32)}
        arcDashGap={(d: object) => ((d as ThreatArc).severity === 'blocked' ? 0.9 : 1.6)}
        arcDashAnimateTime={(d: object) => ((d as ThreatArc).severity === 'blocked' ? 900 : 1500)}
        atmosphereColor="#d1d1d1"
        atmosphereAltitude={0.11}
        pointsData={hotspotData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d: object) => 0.008 + (d as ThreatHotspot).intensity * 0.015}
        pointRadius={(d: object) => 0.08 + (d as ThreatHotspot).intensity * 0.1}
        pointColor={(d: object) =>
          (d as ThreatHotspot).intensity >= 0.72
            ? 'rgba(239,68,68,0.92)'
            : (d as ThreatHotspot).intensity >= 0.6
              ? 'rgba(245,158,11,0.9)'
              : 'rgba(209,209,209,0.85)'
        }
        pointLabel={(d: object) =>
          `${(d as ThreatHotspot).label} • intensity ${Math.round((d as ThreatHotspot).intensity * 100)}%`
        }
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d: object) => [
          (d as ThreatHotspot).intensity >= 0.72 ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.5)',
          'rgba(0,0,0,0)',
        ]}
        ringMaxRadius={(d: object) => 1.3 + (d as ThreatHotspot).intensity * 2.4}
        ringPropagationSpeed={2.6}
        ringRepeatPeriod={1200}
      />
    </div>
  );
};
