import { memo } from 'react';

// Skeleton de carga (no usa estado, solo CSS). Mejora percepción vs texto plano.
function SkeletonGrid({ count = 6 }) {
  return (
    <section className="lista" aria-busy="true" aria-label="Cargando">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sk-card">
          <div className="sk-mag" />
          <div className="sk-lines">
            <div className="sk-line w70" />
            <div className="sk-line w50" />
            <div className="sk-line w40" />
          </div>
        </div>
      ))}
    </section>
  );
}

export default memo(SkeletonGrid);
