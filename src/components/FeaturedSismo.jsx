import { memo, useMemo } from 'react';
import { formatLocalDate, magnitudeBucket, relativeTime } from '../utils/usgs';

// Destaca el sismo más fuerte del listado filtrado.
function FeaturedSismo({ sismos }) {
  const top = useMemo(() => {
    if (!sismos.length) return null;
    return sismos.reduce((a, b) => (b.mag > a.mag ? b : a));
  }, [sismos]);

  if (!top) return null;
  const nivel = magnitudeBucket(top.mag);

  return (
    <article className={`featured nivel-${nivel}`} aria-label="Sismo más fuerte">
      <header>
        <span className="pill">Evento más fuerte</span>
        <span className="when">{relativeTime(top.time)}</span>
      </header>
      <div className="featured-body">
        <div className="featured-mag">
          <b>{top.mag.toFixed(1)}</b>
          <small>Magnitud</small>
        </div>
        <div className="featured-info">
          <h3>{top.place ?? 'Ubicación desconocida'}</h3>
          <div className="featured-meta">
            <span>📅 {formatLocalDate(top.time)}</span>
            <span>📍 {top.depth.toFixed(0)} km de profundidad</span>
          </div>
          <a href={top.url} target="_blank" rel="noreferrer" className="featured-cta">
            Ver detalle USGS ↗
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(FeaturedSismo);
