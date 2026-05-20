import { memo } from 'react';
import { formatLocalDate, magnitudeBucket } from '../utils/usgs';

function SismoCard({ sismo }) {
  const { mag, place, time, depth, url } = sismo;
  const nivel = magnitudeBucket(mag);

  return (
    <article className={`sismo-card nivel-${nivel}`}>
      <div className="mag" aria-label={`Magnitud ${mag.toFixed(1)}`}>
        {mag.toFixed(1)}
      </div>
      <div className="detalle">
        <h3>{place ?? 'Ubicación desconocida'}</h3>
        <dl>
          <div><dt>Fecha</dt><dd>{formatLocalDate(time)}</dd></div>
          <div><dt>Profundidad</dt><dd>{depth.toFixed(0)} km</dd></div>
          <div><dt>Categoría</dt><dd className={`badge ${nivel}`}>{nivel}</dd></div>
        </dl>
        <a href={url} target="_blank" rel="noreferrer">Detalle USGS ↗</a>
      </div>
    </article>
  );
}

// memo crítico: la lista renderiza decenas de tarjetas.
// Sin memo, cambiar el theme re-renderizaría todas innecesariamente.
export default memo(SismoCard);
