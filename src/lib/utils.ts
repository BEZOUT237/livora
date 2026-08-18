import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms asset URLs to ensure they work in both development and production
 * Handles: /covers/*, /__l5e/*, and absolute URLs
 */
export function getPublicAssetUrl(url: string | null): string | null {
  if (!url) return null;
  
  // If it's already a full URL or a simple public path, return as-is
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  // Fallback for any unexpected format
  return url;
}
