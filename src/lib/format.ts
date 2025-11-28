export function formatCurrency(
  amount: number,
  currency: 'IDR' | 'USD' = 'IDR'
) {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
export function formatDistance(distance?: number | null) {
  const ok =
    typeof distance === 'number' && isFinite(distance) && distance >= 0;
  if (!ok) return undefined;
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  if (distance < 10) return `${distance.toFixed(1)} km`;
  return `${distance.toFixed(0)} km`;
}
export function formatPlaceAndDistance(
  place?: string | null,
  distance?: number | null
) {
  const p =
    typeof place === 'string' && place.trim().length ? place.trim() : undefined;
  const d = formatDistance(distance);
  const parts = [p, d].filter(Boolean) as string[];
  return parts.length ? parts.join(' · ') : '—';
}
export function computeDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
