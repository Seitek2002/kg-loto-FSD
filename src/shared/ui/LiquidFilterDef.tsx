'use client';

import { useEffect, useState } from 'react';
import { generateGlassMap } from '@/shared/lib/glass-generator';

export function LiquidFilterDef() {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const url = generateGlassMap(450, 80, 25);
      setMapUrl(url);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mapUrl) return null;

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, zIndex: -1, pointerEvents: 'none' }}>
      <defs>
        <filter id='liquid-glass' x='-20%' y='-20%' width='140%' height='140%' colorInterpolationFilters='sRGB'>
          <feImage href={mapUrl} x='0' y='0' width='100%' height='100%' preserveAspectRatio='none' result='displacement-map' />
          <feGaussianBlur in='displacement-map' stdDeviation='1.5' result='smooth-map' />
          <feDisplacementMap in='SourceGraphic' in2='smooth-map' scale='30' xChannelSelector='R' yChannelSelector='G' result='refracted' />
          <feSpecularLighting in='smooth-map' surfaceScale='5' specularConstant='1.2' specularExponent='30' lightingColor='#ffffff' result='specular'>
            <fePointLight x='100' y='-100' z='200' />
          </feSpecularLighting>
          <feComposite in='specular' in2='refracted' operator='arithmetic' k1='0' k2='1' k3='1' k4='0' />
        </filter>
      </defs>
    </svg>
  );
}