const DEFAULT_BACKEND_BASE = 'http://localhost:5000';

function getBackendBaseUrl(): string {
  // Prefer explicit VITE_API_URL (strip trailing /api if present)
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) {
    return env.replace(/\/api\/?$/i, '');
  }

  // Fallback: try Vite dev-server proxy style
  return DEFAULT_BACKEND_BASE;
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Normalizes product/image URLs coming from API/DB.
 * Supports:
 * - absolute URLs (http/https)
 * - /uploads/... (root-relative)
 * - uploads/... (missing leading slash)
 * - bare filenames (abc.jpg/png)
 */
export function resolveImageUrl(input?: string | null): string {
  if (!input) return '/placeholder.svg';
  const url = String(input).trim();
  if (!url) return '/placeholder.svg';

  if (url === '/placeholder.svg' || url === '/placeholder.png') return url;
  if (isAbsoluteUrl(url)) return url;

  const backendBase = getBackendBaseUrl();

  if (url.startsWith('/uploads/')) return `${backendBase}${url}`;
  if (url.startsWith('uploads/')) return `${backendBase}/${url}`;

  // If it's just a filename like abc.jpg
  if (/^[a-zA-Z0-9._-]+\.(png|jpe?g|gif|webp|svg)$/i.test(url)) {
    return `${backendBase}/uploads/${url}`;
  }

  // Unknown relative path: keep it as-is to avoid breaking existing behavior.
  return url;
}

