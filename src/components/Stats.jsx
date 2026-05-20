import { memo, useMemo } from 'react';

// Paso 4: useMemo para no recalcular agregados en cada re-render del padre.
function Stats({ sismos }) {
  const stats = useMemo(() => {
    if (!sismos.length) {
      return { total: 0, prom: 0, maxMag: 0, maxPlace: '—', profProm: 0 };
    }
    let sumMag = 0;
    let sumDepth = 0;
    let maxMag = -Infinity;
    let maxPlace = '';
    for (const s of sismos) {
      sumMag += s.mag;
      sumDepth += s.depth;
      if (s.mag > maxMag) {
        maxMag = s.mag;
        maxPlace = s.place ?? '—';
      }
    }
    return {
      total: sismos.length,
      prom: sumMag / sismos.length,
      maxMag,
      maxPlace,
      profProm: sumDepth / sismos.length,
    };
  }, [sismos]);

  return (
    <section className="stats">
      <div className="stat"><span>Total</span><b>{stats.total}</b></div>
      <div className="stat"><span>Mag. promedio</span><b>{stats.prom.toFixed(2)}</b></div>
      <div className="stat"><span>Mag. máxima</span><b>{stats.maxMag === -Infinity ? '—' : stats.maxMag.toFixed(1)}</b></div>
      <div className="stat wide"><span>Epicentro más fuerte</span><b>{stats.maxPlace}</b></div>
      <div className="stat"><span>Prof. promedio</span><b>{stats.profProm.toFixed(0)} km</b></div>
    </section>
  );
}

export default memo(Stats);
