import { memo } from 'react';
import SismoCard from './SismoCard';
import SkeletonGrid from './SkeletonGrid';

function SismoList({ sismos, loading, error }) {
  if (loading) return <SkeletonGrid count={8} />;
  if (error) {
    return (
      <div className="state error">
        <span className="state-icon">⚠️</span>
        <h3>No se pudo consultar al USGS</h3>
        <p>{error}</p>
      </div>
    );
  }
  if (!sismos.length) {
    return (
      <div className="state">
        <span className="state-icon">🔍</span>
        <h3>Sin coincidencias</h3>
        <p>Prueba aumentar la ventana de días o bajar la magnitud mínima.</p>
      </div>
    );
  }

  return (
    <section className="lista">
      {sismos.map((s) => <SismoCard key={s.id} sismo={s} />)}
    </section>
  );
}

export default memo(SismoList);
