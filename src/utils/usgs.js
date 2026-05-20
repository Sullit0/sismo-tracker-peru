// Bounding box aproximado del territorio peruano
// (incluye dominio marítimo donde ocurre la mayoría de sismos de subducción)
export const PERU_BBOX = {
  minLat: -18.5,
  maxLat: 0.0,
  minLng: -82.0,
  maxLng: -68.5,
};

export function buildUsgsUrl({ days = 30, minMag = 4.0 } = {}) {
  // endtime ligeramente atrasado: USGS no acepta endtime en el futuro y la
  // ventana de hoy puede estar aún siendo procesada.
  const endtime = new Date(Date.now() - 60 * 60 * 1000);
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

const RTF = new Intl.RelativeTimeFormat('es-PE', { numeric: 'auto' });

export function relativeTime(ms, now = Date.now()) {
  const diffSec = Math.round((ms - now) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return RTF.format(diffSec, 'second');
  if (abs < 3600) return RTF.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return RTF.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 2592000) return RTF.format(Math.round(diffSec / 86400), 'day');
  return RTF.format(Math.round(diffSec / 2592000), 'month');
}

export const MAG_BUCKETS = [
  { id: 'leve', label: 'Leve', min: 0, color: '#5eead4' },
  { id: 'moderado', label: 'Moderado', min: 5, color: '#f59e0b' },
  { id: 'fuerte', label: 'Fuerte', min: 6, color: '#ef4444' },
  { id: 'severo', label: 'Severo', min: 7, color: '#dc2626' },
];
