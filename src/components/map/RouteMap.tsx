"use client";

import { useLoadScript, GoogleMap, MarkerF, PolylineF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

interface TempleLocation {
  lat: number;
  lng: number;
  name: string;
}

export function RouteMap({ stops }: { stops: TempleLocation[] }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || stops.length === 0) return <div className="w-full h-full bg-stone-200 animate-pulse"></div>;

  const center = { lat: stops[0].lat, lng: stops[0].lng };
  const path = stops.map(s => ({ lat: s.lat, lng: s.lng }));

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      options={{ disableDefaultUI: true }}
    >
      {stops.map((stop, i) => (
        <MarkerF key={i} position={{ lat: stop.lat, lng: stop.lng }} label={(i+1).toString()} />
      ))}
      <PolylineF
        path={path}
        options={{
          strokeColor: '#ea580c',
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }}
      />
    </GoogleMap>
  );
}
