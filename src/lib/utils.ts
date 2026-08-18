import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms local Lovable asset URLs to public CDN URLs
 * Works with both development (/__l5e/...) and production URLs
 */
export function getPublicAssetUrl(url: string | null): string | null {
  if (!url) return null;
  
  // If it's already a full URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Transform /__l5e/assets-v1/{id}/{filename} to public CDN URL
  if (url.startsWith("/__l5e/assets-v1/")) {
    // Extract the asset ID and filename
    const match = url.match(/\/__l5e\/assets-v1\/([^/]+)\/(.+)$/);
    if (match) {
      const [, assetId, filename] = match;
      // Use multiple CDN options with fallback strategy
      // First try Lovable's public CDN endpoint
      return `https://cdn.lovable.dev/assets/${assetId}/${filename}`;
    }
  }

  return url;
}
