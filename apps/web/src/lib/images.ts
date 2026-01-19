/**
 * Generate a consistent fallback background for entities without images
 */
export function getEntityFallbackStyle(name: string): React.CSSProperties {
  // Generate hue from name for consistency
  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue}, 30%, 20%), hsl(${hue + 30}, 25%, 15%))`,
  };
}

/**
 * Get property image URL with fallback
 */
export function getPropertyImageUrl(imageUrl?: string | null): string {
  return imageUrl || '/images/placeholders/property-fallback.jpg';
}

/**
 * Generate tenant monogram
 */
export function getTenantMonogram(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
