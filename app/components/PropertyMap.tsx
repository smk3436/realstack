"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface PropertyMapProps {
  lat: number;
  lng: number;
  propertyTitle: string;
}

export default function PropertyMap({ lat, lng, propertyTitle }: PropertyMapProps) {
  const [origin, setOrigin] = useState("");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = async () => {
    if (!origin.trim()) return alert("Please enter a starting location.");
    setLoading(true);

    try {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
      const geoResponse = await fetch(geocodeUrl);
      const geoData = await geoResponse.json();

      if (!geoData.features || geoData.features.length === 0) {
        throw new Error("Location not found. Please try a more specific address.");
      }

      const [originLng, originLat] = geoData.features[0].center;

      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${originLng},${originLat};${lng},${lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const directionResponse = await fetch(directionsUrl);
      const directionData = await directionResponse.json();

      if (!directionData.routes || directionData.routes.length === 0) {
        throw new Error("Could not calculate a route to this property.");
      }

      const route = directionData.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMins = Math.round(route.duration / 60);

      setDistance(`${distanceKm} km`);
      setDuration(`${durationMins} mins`);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNavigationLink = () => {
    return `https://www.mapbox.com/directions/driving/${lng},${lat}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">🗺️ Location & Commute Insights</h3>

      <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded border dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Check commute to your office:</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter office location (e.g. Hinjewadi)"
            className="flex-1 p-2 border rounded text-sm text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculateRoute()}
          />
          <button
            onClick={calculateRoute}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </div>

        {distance && duration && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="text-green-700 dark:text-green-400 font-bold text-sm">
              🚗 Distance: {distance} | ⏱️ Est. Time: {duration}
            </p>
          </div>
        )}
      </div>

      <div className="h-64 rounded-lg overflow-hidden border dark:border-gray-700 relative">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={{
              longitude: lng,
              latitude: lat,
              zoom: 14
            }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: "100%", height: "100%" }}
          >
            <Marker longitude={lng} latitude={lat} anchor="bottom">
              <div className="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
            </Marker>
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local to view map.
          </div>
        )}
      </div>

      <a
        href={getNavigationLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
      >
        📍 Open in Mapbox Navigation
      </a>
    </div>
  );
}