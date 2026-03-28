/**
 * 
 * 0 -darker--------lighter- 1
 */

export function adjustColorBrightness(hex: string, factor: number): string {
    if (!hex || hex === 'transparent') return hex;
    
    // Remove hash if present
    hex = hex.replace(/^#/, '');

    // Handle 3-digit hex
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6) return '#' + hex;

    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Apply factor (e.g., 0.8 for 20% darker, 1.2 for 20% lighter)
    r = Math.max(0, Math.min(255, Math.round(r * factor)));
    g = Math.max(0, Math.min(255, Math.round(g * factor)));
    b = Math.max(0, Math.min(255, Math.round(b * factor)));

    // Convert back to hex
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

export function getContrastTextColor(hex: string): string {
    if (!hex || hex === 'transparent') return '#334155'; // Use slate-700 by default

    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    if (hex.length !== 6) return '#334155';

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (using standard sRGB formula approximation)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // If luminance is high (light background), return dark text. Otherwise, light text.
    return luminance > 0.6 ? '#334155' : '#ffffff';
}
