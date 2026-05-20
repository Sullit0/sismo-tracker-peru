import { memo } from 'react';
import SismoCard from './SismoCard';

function SismoList({ sismos, loading, error }) {
  if (loading) return <div className="state">Cargando datos del USGS…</div>;
  if (error) return <div className="state error">Error: {error}</div>;
  if (!sismos.length) return <div className="state">Sin sismos para estos filtros.</div>;

  return (
    <section className="lista">
      {sismos.map((s) => <SismoCard key={s.id} sismo={s} />)}
    </section>
  );
}

export default memo(SismoList);
