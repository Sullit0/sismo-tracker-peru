import { memo, useMemo } from 'react';
import { MAG_BUCKETS, magnitudeBucket } from '../utils/usgs';

// Mini histograma horizontal: distribución por categoría de magnitud.
function MagnitudeBar({ sismos }) {
  const conteo = useMemo(() => {
    const acc = { leve: 0, moderado: 0, fuerte: 0, severo: 0 };
    for (const s of sismos) acc[magnitudeBucket(s.mag)]++;
    return acc;
  }, [sismos]);

  const total = sismos.length || 1;

  return (
    <div className="mag-bar" role="img" aria-label="Distribución por magnitud">
      <div className="mag-bar-track">
        {MAG_BUCKETS.map((b) => {
          const n = conteo[b.id];
          const pct = (n / total) * 100;
          if (!n) return null;
          return (
            <span
              key={b.id}
              className="mag-bar-seg"
              style={{ width: `${pct}%`, background: b.color }}
              title={`${b.label}: ${n} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>
      <div className="mag-bar-legend">
        {MAG_BUCKETS.map((b) => (
          <span key={b.id} className="mag-bar-leg">
            <i style={{ background: b.color }} /> {b.label} <b>{conteo[b.id]}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default memo(MagnitudeBar);
