"use client";

import { useLoadScript, GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem' // xl rounded to match other UI
};

interface TempleLocation {
  lat: number;
  lng: number;
  name: string;
}

export function TempleMap({ temple }: { temple: TempleLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  });

  const [infoOpen, setInfoOpen] = useState(false);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div className="w-full h-full bg-stone-100 animate-pulse rounded-xl"></div>;

  const center = { lat: temple.lat, lng: temple.lng };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <MarkerF
        position={center}
        onClick={() => setInfoOpen(true)}
      />

      {infoOpen && (
        <InfoWindowF
          position={center}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1">
            <p className="font-bold text-stone-900">{temple.name}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
