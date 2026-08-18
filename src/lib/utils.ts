import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms local Lovable asset URLs to public CDN URLs for production
 */
export function getPublicAssetUrl(url: string | null): string | null {
  if (!url) return null;
  
  // If it's already a full URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Transform /__l5e/assets-v1/{id}/{filename} pattern
  if (url.startsWith("/__l5e/assets-v1/")) {
    const match = url.match(/\/__l5e\/assets-v1\/([^/]+)\/(.+)$/);
    if (match) {
      const [, assetId, filename] = match;
      
      // Try multiple CDN endpoints in order of preference
      const cdnOptions = [
        // Option 1: Lovable asset CDN (most likely to work with Lovable projects)
        `https://cdn.lovable.dev/assets/${assetId}/${filename}`,
        // Option 2: Direct Lovable assets endpoint
        `https://assets.lovable.dev/${assetId}/${filename}`,
        // Option 3: Fallback - local path (for development)
        url,
      ];
      
      // Return the first option (can be extended with fetch-based verification if needed)
      return cdnOptions[0];
    }
  }

  return url;
}
