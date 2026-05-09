import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export const GlobeComponent = () => {
  const globeEl = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

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
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    }
  }, []);

  const arcsData = [...Array(20).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: ['rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)'][Math.round(Math.random())]
  }));

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] flex items-center justify-center">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={arcsData}
        arcColor='color'
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={1500}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
        pointsData={[]}
      />
    </div>
  );
};
