import { memo } from 'react';
import { formatLocalDate, magnitudeBucket, relativeTime } from '../utils/usgs';

function SismoCard({ sismo }) {
  const { mag, place, time, depth, url } = sismo;
  const nivel = magnitudeBucket(mag);

  return (
    <article className={`sismo-card nivel-${nivel}`}>
      <div className="sismo-card-top">
        <div className="mag" aria-label={`Magnitud ${mag.toFixed(1)}`}>
          {mag.toFixed(1)}
        </div>
        <span className={`badge ${nivel}`}>{nivel}</span>
      </div>
      <div className="detalle">
        <h3>{place ?? 'Ubicación desconocida'}</h3>
        <div className="meta">
          <span title={formatLocalDate(time)}>🕒 {relativeTime(time)}</span>
          <span>📍 {depth.toFixed(0)} km</span>
        </div>
        <a href={url} target="_blank" rel="noreferrer">Detalle USGS ↗</a>
      </div>
    </article>
  );
}

// memo crítico: la lista renderiza decenas de tarjetas.
// Sin memo, cambiar el theme re-renderizaría todas innecesariamente.
export default memo(SismoCard);
