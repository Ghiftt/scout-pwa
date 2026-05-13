import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsdc(amount: number): string {
  return amount.toFixed(2);
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  return `${miles.toFixed(1)} mi`;
}

export function formatTimeRemaining(expiresAt: number): string {
  const remaining = Math.max(0, expiresAt - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatConfidence(bps: number): string {
  return `${(bps / 100).toFixed(2)} bps`;
}

export function getTaskTypeColor(type: "Verify" | "Execute"): {
  bg: string;
  text: string;
} {
  if (type === "Verify") {
    return { bg: "bg-forest-50", text: "text-forest-600" };
  }
  return { bg: "bg-amber-50", text: "text-amber-800" };
}

export function getDistanceFromLatLng(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isWithinRadius(
  userLat: number,
  userLng: number,
  taskLat: number,
  taskLng: number,
  radiusMeters: number
): boolean {
  const R = 6371000; // Earth radius in meters
  const dLat = ((taskLat - userLat) * Math.PI) / 180;
  const dLng = ((taskLng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((taskLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance <= radiusMeters;
}

export function shortenHash(hash: string, chars = 8): string {
  if (!hash) return "";
  return `${hash.slice(0, chars)}...${hash.slice(-6)}`;
}