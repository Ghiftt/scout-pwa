"use client";

import { useEffect, useRef } from "react";

interface TaskMapProps {
  lat: number;
  lng: number;
  radiusMeters: number;
  className?: string;
}

export default function TaskMap({ lat, lng, radiusMeters, className }: TaskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!mapRef.current) return;

    initializedRef.current = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const container = mapRef.current!;
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      const map = L.map(container, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.circle([lat, lng], {
        radius: radiusMeters,
        color: "#2D5A3D",
        fillColor: "#2D5A3D",
        fillOpacity: 0.08,
        weight: 1.5,
        opacity: 0.35,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#2D5A3D;border-radius:50%;border:3px solid #FAFAF7;box-shadow:0 0 0 1.5px #2D5A3D;"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker([lat, lng], { icon }).addTo(map);
      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [lat, lng, radiusMeters]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ height: "180px", borderRadius: "12px", overflow: "hidden" }}
    />
  );
}
