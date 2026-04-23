/** Shared helpers for reservation stop ordering and Google Maps URLs (control panel dialogs). */

function reservationStopTypeOrder(t: string | undefined | null): number {
  const x = String(t || '').toLowerCase();
  if (x === 'pickup') return 0;
  if (x === 'enroute') return 1;
  if (x === 'dropoff' || x === 'destination') return 2;
  return 3;
}

export function parseStopGeoLatLng(geo: string | undefined | null): { lat: number; lng: number } | null {
  if (!geo || !String(geo).trim()) return null;
  const g = String(geo).trim();
  if (/^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(g)) {
    const [a, b] = g.split(',').map((s) => parseFloat(s.trim()));
    if (!isNaN(a) && !isNaN(b) && Math.abs(a) <= 90 && Math.abs(b) <= 180) {
      return { lat: a, lng: b };
    }
  }
  const m = g.replace(/^POINT\s*\(/i, '').replace(/\)\s*$/i, '').match(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/);
  if (m) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[2]);
    if (!isNaN(a) && !isNaN(b)) {
      if (Math.abs(a) > 90) return { lat: b, lng: a };
      return { lat: a, lng: b };
    }
  }
  return null;
}

/** Text or `lat,lng` for Maps directions / place API. */
export function getReservationStopMapQuery(stop: any): string {
  const ll = parseStopGeoLatLng(stop?.encodedStopAddressGeoLocation);
  if (ll) return `${ll.lat},${ll.lng}`;
  const addr = [stop?.reservationStopAddress, stop?.reservationStopAddressDetails]
    .filter((x) => x && String(x).trim())
    .join(', ');
  return (addr || '').trim();
}

/**
 * Stops in travel order: priority when set, else Pickup → Enroute → Dropoff/Destination.
 */
export function orderReservationStops(stopsDetails: any[] | undefined | null): any[] {
  if (!stopsDetails?.length) return [];
  const stops = stopsDetails.map((s, idx) => ({ ...s, __idx: idx }));
  stops.sort((a, b) => {
    const pa = a.reservationStopOrderPriority;
    const pb = b.reservationStopOrderPriority;
    const na = Number(pa);
    const nb = Number(pb);
    if (
      pa !== undefined &&
      pa !== null &&
      pa !== '' &&
      pb !== undefined &&
      pb !== null &&
      pb !== '' &&
      !isNaN(na) &&
      !isNaN(nb)
    ) {
      return na - nb;
    }
    const ta = reservationStopTypeOrder(a.reservationStopType || a.stopType);
    const tb = reservationStopTypeOrder(b.reservationStopType || b.stopType);
    if (ta !== tb) return ta - tb;
    return (a.__idx || 0) - (b.__idx || 0);
  });
  return stops;
}

/** Browser `/maps/dir/...` URL (2+ stops with a query each). */
export function buildGoogleMapsDirUrlForStops(ordered: any[]): string {
  const parts = ordered.map((s) => getReservationStopMapQuery(s)).filter((q) => q && String(q).trim());
  if (parts.length < 2) return '';
  return 'https://www.google.com/maps/dir/' + parts.map((p) => encodeURIComponent(p)).join('/');
}

/**
 * Embed API URL. `keyEncoded` should be `encodeURIComponent(apiKey)`.
 * Pass only stops that already have a non-empty map query (or pass full list — empty segments are skipped in path).
 */
export function buildGoogleMapsEmbedDirectionsUrl(ordered: any[], keyEncoded: string): string | null {
  const withQuery = ordered.filter((s) => getReservationStopMapQuery(s));
  if (!withQuery.length) return null;

  const segEnc = (s: any) => encodeURIComponent(getReservationStopMapQuery(s));

  if (withQuery.length === 1) {
    return `https://www.google.com/maps/embed/v1/place?key=${keyEncoded}&q=${segEnc(withQuery[0])}`;
  }

  const origin = segEnc(withQuery[0]);
  const destination = segEnc(withQuery[withQuery.length - 1]);
  const middle = withQuery
    .slice(1, -1)
    .map((s) => getReservationStopMapQuery(s))
    .join('|');
  let url = `https://www.google.com/maps/embed/v1/directions?key=${keyEncoded}&origin=${origin}&destination=${destination}&mode=driving`;
  if (middle) {
    url += `&waypoints=${encodeURIComponent(middle)}`;
  }
  return url;
}
