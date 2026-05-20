// Bounding box aproximado del territorio peruano
// (incluye dominio marítimo donde ocurre la mayoría de sismos de subducción)
export const PERU_BBOX = {
  minLat: -18.5,
  maxLat: 0.0,
  minLng: -82.0,
  maxLng: -68.5,
};

export function buildUsgsUrl({ days = 30, minMag = 4.0, nonce = 0 } = {}) {
  const endtime = new Date();
  const starttime = new Date(endtime.getTime() - days * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: starttime.toISOString().slice(0, 10),
    endtime: endtime.toISOString().slice(0, 10),
    minlatitude: String(PERU_BBOX.minLat),
    maxlatitude: String(PERU_BBOX.maxLat),
    minlongitude: String(PERU_BBOX.minLng),
    maxlongitude: String(PERU_BBOX.maxLng),
    minmagnitude: String(minMag),
    orderby: 'time',
    limit: '500',
  });
  // nonce: USGS ignora params desconocidos; lo usamos como cache-buster real
  // para forzar el refresh sin tener que recordarlo en el dep array.
  if (nonce) params.set('_', String(nonce));
  return `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;
}

export function magnitudeBucket(mag) {
  if (mag >= 7) return 'severo';
  if (mag >= 6) return 'fuerte';
  if (mag >= 5) return 'moderado';
  return 'leve';
}

export function formatLocalDate(ms) {
  return new Date(ms).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  });
}
